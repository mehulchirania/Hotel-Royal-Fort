import express from 'express';
import { Resend } from 'resend';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 8080;
const distDir = path.join(__dirname, 'dist');
const enquiryToEmail = process.env.ENQUIRY_TO_EMAIL || 'gmroyalfort@gmail.com';
const engagementAdminToken = process.env.ENGAGEMENT_ADMIN_TOKEN;
const isProduction = process.env.NODE_ENV === 'production';
const engagementIpSalt = process.env.ENGAGEMENT_IP_SALT || 'hotel-royal-fort-engagement';
if (isProduction && !process.env.ENGAGEMENT_IP_SALT) {
  // A published default salt makes the IP hashes trivially reversible.
  console.error('ENGAGEMENT_IP_SALT is not set — IP hashes use a public default salt.');
}
const ENGAGEMENT_COLLECTION = 'engagementVisits';
// Data retention: analytics rows are deleted after this many days (matches the
// 90 days promised in the privacy policy).
const ENGAGEMENT_RETENTION_DAYS = Number(process.env.ENGAGEMENT_RETENTION_DAYS) || 90;
const PURGE_INTERVAL_MS = 6 * 60 * 60 * 1000;

// Cloud Run / App Hosting terminate TLS in front of us and set X-Forwarded-*.
app.set('trust proxy', true);
app.disable('x-powered-by');

/** Force HTTPS in production and send HSTS plus the standard hardening headers. */
app.use((req, res, next) => {
  const host = req.headers.host || '';
  // One canonical host: www.hotelroyalfort.in → hotelroyalfort.in (and http → https).
  if (isProduction && (req.headers['x-forwarded-proto'] === 'http' || host.startsWith('www.'))) {
    return res.redirect(301, `https://${host.replace(/^www\./, '')}${req.originalUrl}`);
  }
  // Keep private surfaces out of search results even if something links to them.
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), payment=(), geolocation=(self)');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-src https://maps.google.com https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(isProduction ? ['upgrade-insecure-requests'] : []),
    ].join('; '),
  );
  next();
});

/** Small in-memory fixed-window limiter. Per instance, which is enough to blunt form spam. */
function rateLimit({ windowMs, max }) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.reset <= now) hits.delete(key);
  }, windowMs).unref();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.reset - now) / 1000));
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }
    return next();
  };
}

const enquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
const engagementLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

/**
 * Engagement rows live in Firestore, not on disk.
 *
 * App Hosting runs on Cloud Run, whose filesystem is in-memory and per
 * instance: the previous CSV lost every row on restart or scale-down and
 * diverged between instances. Firestore is also where the admin dashboard
 * reads from, so the two can never disagree.
 *
 * Initialisation is lazy and failure-tolerant — if credentials are missing
 * (a plain local checkout with no ADC), the site must still serve; only the
 * engagement endpoints degrade.
 */
let firestore = null;
let firestoreError = null;

function getDb() {
  if (firestore) return firestore;
  if (firestoreError) throw firestoreError;

  try {
    if (getApps().length === 0) {
      const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || 'hotel-royal-fort-498215';
      const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'service-account.json');

      let credential;
      if (fs.existsSync(keyPath)) {
        credential = cert(keyPath);
      } else {
        credential = applicationDefault();
      }

      initializeApp({
        credential,
        projectId,
      });
    }
    firestore = getFirestore();
    firestore.settings({ ignoreUndefinedProperties: true });
    return firestore;
  } catch (error) {
    firestoreError = error;
    console.error('Firestore unavailable — engagement tracking disabled:', error.message);
    throw error;
  }
}

const ENGAGEMENT_HEADERS = [
  'visit_id',
  'created_at',
  'last_updated_at',
  'landing_path',
  'current_page',
  'pages_visited',
  'last_page_at',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'timezone',
  'language',
  'languages',
  'platform',
  'screen',
  'viewport',
  'device_pixel_ratio',
  'device_memory',
  'hardware_concurrency',
  'connection_type',
  'touch_support',
  'user_agent',
  'accept_language',
  'ip_hash',
  'location_status',
  'latitude',
  'longitude',
  'location_accuracy_m',
  'location_captured_at',
];

let resendClient = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/** Only these fields are ever read from an enquiry; everything else is dropped. */
const ENQUIRY_FIELDS = {
  name: 100,
  phone: 20,
  email: 120,
  checkIn: 10,
  checkOut: 10,
  guests: 3,
  roomType: 60,
  message: 1000,
};

function cleanField(value, maxLength) {
  if (typeof value !== 'string') return '';
  // Strip control characters (incl. CR/LF, which enable email header injection).
  return value.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);
}

function cleanEnquiry(body) {
  const clean = {};
  for (const [key, max] of Object.entries(ENQUIRY_FIELDS)) {
    const value = key === 'message' ? cleanField(body[key], max) : cleanField(body[key], max).replace(/\s+/g, ' ');
    if (value) clean[key] = value;
  }
  return clean;
}

function formatEnquiry(clean) {
  return Object.entries(clean)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{6,19}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeCell(value, maxLength = 500) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength);
}

function csvEscape(value) {
  const cell = sanitizeCell(value);
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

function rowToCsv(row) {
  return ENGAGEMENT_HEADERS.map((header) => csvEscape(row[header])).join(',');
}

function buildCsv(rows) {
  return [ENGAGEMENT_HEADERS.join(','), ...rows.map(rowToCsv)].join('\n');
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const firstForwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0];
  return sanitizeCell(firstForwardedIp || req.socket.remoteAddress || '', 120);
}

function hashIp(ip) {
  if (!ip) return '';
  return crypto
    .createHash('sha256')
    .update(`${engagementIpSalt}:${ip}`)
    .digest('hex')
    .slice(0, 32);
}

const ADMIN_COOKIE = 'rf_admin';

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return '';
}

/** Constant-time comparison so the token cannot be guessed by timing. */
function isAdminToken(candidate) {
  if (!engagementAdminToken || typeof candidate !== 'string' || !candidate) return false;
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(engagementAdminToken).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Bearer header or the HttpOnly cookie. The query string is only honoured once, at login. */
function isAdminRequest(req) {
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return isAdminToken(bearer) || isAdminToken(readCookie(req, ADMIN_COOKIE));
}

/**
 * Purge analytics older than the retention window. Rows carry `created_at`
 * (ISO string), so a plain range query finds them. Runs at start-up and every
 * few hours while the instance is alive; Cloud Run may scale to zero, so a
 * Firestore TTL policy on `expire_at` is the backstop (see README).
 */
async function purgeExpiredEngagement() {
  const cutoff = new Date(Date.now() - ENGAGEMENT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const db = getDb();
  let removed = 0;
  for (;;) {
    const snapshot = await db
      .collection(ENGAGEMENT_COLLECTION)
      .where('created_at', '<', cutoff)
      .limit(400)
      .get();
    if (snapshot.empty) break;
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    removed += snapshot.size;
    if (snapshot.size < 400) break;
  }
  if (removed) console.log(`Retention purge removed ${removed} engagement rows older than ${ENGAGEMENT_RETENTION_DAYS} days.`);
}

let lastPurge = 0;
function schedulePurge() {
  if (Date.now() - lastPurge < PURGE_INTERVAL_MS) return;
  lastPurge = Date.now();
  purgeExpiredEngagement().catch((error) => console.error('Retention purge failed:', error.message));
}

/** Newest first. `limit` keeps the dashboard bounded as the collection grows. */
async function readEngagementRows(limit = 1000) {
  const snapshot = await getDb()
    .collection(ENGAGEMENT_COLLECTION)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    // Normalise to plain strings so the CSV and dashboard stay format-agnostic.
    return ENGAGEMENT_HEADERS.reduce((row, header) => {
      row[header] = data[header] === undefined || data[header] === null ? '' : String(data[header]);
      return row;
    }, {});
  });
}

async function createEngagementRow(visitId, row) {
  await getDb().collection(ENGAGEMENT_COLLECTION).doc(visitId).set({
    ...row,
    written_at: FieldValue.serverTimestamp(),
    // Enable a Firestore TTL policy on this field to delete rows even if the
    // server is scaled to zero (see README).
    expire_at: new Date(Date.now() + ENGAGEMENT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
  });
}

async function updateEngagementRow(visitId, patch) {
  const ref = getDb().collection(ENGAGEMENT_COLLECTION).doc(visitId);
  const snapshot = await ref.get();
  if (!snapshot.exists) return null;
  await ref.update({ ...patch, written_at: FieldValue.serverTimestamp() });
  return { ...snapshot.data(), ...patch };
}

function escapeHtml(value) {
  return sanitizeCell(value, 1000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Same escaping as escapeHtml, but keeps line breaks (for the email body). */
function escapeHtmlPreserveLines(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
}

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    const value = row[key] || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function topEntries(counts, limit = 5) {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
}

function renderSummaryItem(label, value) {
  return `
    <div class="summary-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderList(title, entries) {
  const items = entries.length
    ? entries.map(([label, count]) => `<li><span>${escapeHtml(label)}</span><b>${count}</b></li>`).join('')
    : '<li><span>No data yet</span><b>0</b></li>';

  return `
    <section class="panel">
      <h2>${escapeHtml(title)}</h2>
      <ul>${items}</ul>
    </section>
  `;
}

function renderEngagementDashboard(rows) {
  const sortedRows = [...rows].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const totalVisits = rows.length;
  const preciseLocations = rows.filter((row) => row.location_status === 'granted').length;
  const uniqueVisitors = new Set(rows.map((row) => row.ip_hash).filter(Boolean)).size;
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const todayVisits = rows.filter((row) => row.created_at?.startsWith(todayPrefix)).length;
  const csvUrl = '/api/engagement/visits.csv';

  const tableRows = sortedRows.map((row) => `
    <tr>
      <td>${escapeHtml(formatDateTime(row.created_at))}</td>
      <td>${escapeHtml(row.current_page)}</td>
      <td>${escapeHtml(row.landing_path)}</td>
      <td>${escapeHtml(row.referrer)}</td>
      <td>${escapeHtml(row.utm_source)}</td>
      <td>${escapeHtml(row.timezone)}</td>
      <td>${escapeHtml(row.language)}</td>
      <td>${escapeHtml(row.viewport)}</td>
      <td>${escapeHtml(row.connection_type)}</td>
      <td>${escapeHtml(row.location_status)}</td>
      <td>${escapeHtml(row.latitude)}</td>
      <td>${escapeHtml(row.longitude)}</td>
      <td>${escapeHtml(row.pages_visited)}</td>
    </tr>
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hotel Royal Fort Engagement</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #171717;
      --muted: #666;
      --line: #e6e0dc;
      --brand: #550a0a;
      --accent: #c5a017;
      --bg: #f7f4f1;
      --panel: #fff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: var(--bg);
    }
    header {
      background: var(--brand);
      color: #fff;
      padding: 24px;
    }
    header div {
      align-items: center;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      margin: 0 auto;
      max-width: 1180px;
    }
    h1 {
      font-size: clamp(22px, 3vw, 34px);
      line-height: 1.1;
      margin: 0;
    }
    a.button {
      background: var(--accent);
      border-radius: 6px;
      color: #fff;
      display: inline-block;
      font-size: 14px;
      font-weight: 700;
      padding: 10px 14px;
      text-decoration: none;
      white-space: nowrap;
    }
    main {
      margin: 0 auto;
      max-width: 1180px;
      padding: 24px;
    }
    .summary {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-bottom: 16px;
    }
    .summary-card, .panel, .table-wrap {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: 0 10px 24px rgba(33, 24, 18, 0.06);
    }
    .summary-card {
      padding: 16px;
    }
    .summary-card span, th {
      color: var(--muted);
      font-size: 12px;
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    .summary-card strong {
      display: block;
      font-size: 28px;
      margin-top: 6px;
    }
    .insights {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-bottom: 16px;
    }
    .panel {
      padding: 16px;
    }
    .panel h2 {
      font-size: 15px;
      margin: 0 0 12px;
    }
    ul {
      display: grid;
      gap: 10px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }
    li span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .table-wrap {
      overflow: auto;
    }
    table {
      border-collapse: collapse;
      min-width: 1180px;
      width: 100%;
    }
    th, td {
      border-bottom: 1px solid var(--line);
      padding: 11px 12px;
      text-align: left;
      vertical-align: top;
    }
    td {
      font-size: 13px;
      max-width: 220px;
      overflow-wrap: anywhere;
    }
    tbody tr:hover {
      background: #fffaf0;
    }
    .empty {
      color: var(--muted);
      padding: 24px;
    }
    @media (max-width: 860px) {
      header div {
        align-items: flex-start;
        flex-direction: column;
      }
      .summary, .insights {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Engagement Table</h1>
      <a class="button" href="${escapeHtml(csvUrl)}">Download CSV</a>
    </div>
  </header>
  <main>
    <section class="summary">
      ${renderSummaryItem('Total visits', totalVisits)}
      ${renderSummaryItem('Visits today', todayVisits)}
      ${renderSummaryItem('Approx. unique visitors', uniqueVisitors)}
      ${renderSummaryItem('Precise locations', preciseLocations)}
    </section>
    <section class="insights">
      ${renderList('Top current pages', topEntries(countBy(rows, 'current_page')))}
      ${renderList('Top UTM sources', topEntries(countBy(rows, 'utm_source')))}
      ${renderList('Location status', topEntries(countBy(rows, 'location_status')))}
    </section>
    <section class="table-wrap">
      ${rows.length ? `
        <table>
          <thead>
            <tr>
              <th>First visit</th>
              <th>Current page</th>
              <th>Landing path</th>
              <th>Referrer</th>
              <th>UTM source</th>
              <th>Timezone</th>
              <th>Language</th>
              <th>Viewport</th>
              <th>Connection</th>
              <th>Location</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Pages visited</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      ` : '<p class="empty">No engagement rows yet. Open the website once and refresh this page.</p>'}
    </section>
  </main>
</body>
</html>`;
}

app.use(express.json({ limit: '20kb' }));

// Malformed JSON must answer 400, not a stack trace.
app.use((err, _req, res, next) => {
  if (err) return res.status(400).json({ message: 'Invalid request.' });
  return next();
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

app.use('/api/engagement', engagementLimiter);

/** Consent withdrawn: remove the visit record. The visit id is an unguessable UUID. */
app.delete('/api/engagement/visit', async (req, res) => {
  const { visitId } = req.body || {};
  if (typeof visitId !== 'string' || !UUID_RE.test(visitId)) {
    return res.status(400).json({ message: 'A valid visitId is required.' });
  }
  try {
    await getDb().collection(ENGAGEMENT_COLLECTION).doc(visitId).delete();
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to delete visit:', error.message);
    return res.status(503).json({ message: 'Engagement tracking unavailable.' });
  }
});

app.post('/api/engagement/visit', async (req, res) => {
  const now = new Date().toISOString();
  const body = req.body || {};
  const visitId = crypto.randomUUID();
  schedulePurge();

  try {
    await createEngagementRow(visitId, {
      visit_id: visitId,
      created_at: now,
      last_updated_at: now,
      landing_path: body.landingPath,
      current_page: body.currentPage,
      pages_visited: body.currentPage,
      last_page_at: now,
      referrer: body.referrer,
      utm_source: body.utm?.source,
      utm_medium: body.utm?.medium,
      utm_campaign: body.utm?.campaign,
      utm_term: body.utm?.term,
      utm_content: body.utm?.content,
      timezone: body.timezone,
      language: body.language,
      languages: Array.isArray(body.languages) ? body.languages.join('|') : '',
      platform: body.platform,
      screen: body.screen,
      viewport: body.viewport,
      device_pixel_ratio: body.devicePixelRatio,
      device_memory: body.deviceMemory,
      hardware_concurrency: body.hardwareConcurrency,
      connection_type: body.connectionType,
      touch_support: body.touchSupport,
      user_agent: req.headers['user-agent'] || body.userAgent,
      accept_language: req.headers['accept-language'],
      ip_hash: hashIp(getClientIp(req)),
      location_status: body.locationStatus || 'not_requested',
    });

    return res.status(201).json({ visitId });
  } catch (error) {
    console.error('Failed to record visit:', error.message);
    // Analytics must never break the page for a guest.
    return res.status(503).json({ message: 'Engagement tracking unavailable.' });
  }
});

app.post('/api/engagement/page', async (req, res) => {
  const { visitId, page } = req.body || {};

  if (typeof visitId !== 'string' || !UUID_RE.test(visitId) || typeof page !== 'string' || !page) {
    return res.status(400).json({ message: 'visitId and page are required.' });
  }

  try {
    const now = new Date().toISOString();
    const ref = getDb().collection(ENGAGEMENT_COLLECTION).doc(String(visitId));

    // A transaction keeps the pages_visited trail intact when a guest clicks
    // through several pages faster than the writes settle.
    const updated = await getDb().runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      if (!snapshot.exists) return false;

      const existing = snapshot.data().pages_visited || '';
      const pages = existing ? existing.split('|') : [];
      pages.push(sanitizeCell(page, 80));

      tx.update(ref, {
        current_page: sanitizeCell(page, 80),
        pages_visited: pages.join('|').slice(0, 1000),
        last_page_at: now,
        last_updated_at: now,
        written_at: FieldValue.serverTimestamp(),
      });
      return true;
    });

    if (!updated) return res.status(404).json({ message: 'Visit was not found.' });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to record page view:', error.message);
    return res.status(503).json({ message: 'Engagement tracking unavailable.' });
  }
});

app.post('/api/engagement/location', async (req, res) => {
  const { visitId, status, latitude, longitude, accuracy } = req.body || {};

  if (typeof visitId !== 'string' || !UUID_RE.test(visitId)) {
    return res.status(400).json({ message: 'visitId is required.' });
  }

  const safeStatus = ['granted', 'denied', 'unavailable', 'error', 'unsupported'].includes(status)
    ? status
    : 'error';
  const validCoords =
    Number.isFinite(latitude) && Math.abs(latitude) <= 90 &&
    Number.isFinite(longitude) && Math.abs(longitude) <= 180;
  const granted = safeStatus === 'granted' && validCoords;
  const now = new Date().toISOString();

  try {
    const updated = await updateEngagementRow(String(visitId), {
      last_updated_at: now,
      location_status: safeStatus,
      latitude: granted ? latitude : '',
      longitude: granted ? longitude : '',
      location_accuracy_m: granted ? accuracy : '',
      location_captured_at: granted ? now : '',
    });

    if (!updated) return res.status(404).json({ message: 'Visit was not found.' });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to record location:', error.message);
    return res.status(503).json({ message: 'Engagement tracking unavailable.' });
  }
});

app.get('/api/engagement/visits.csv', adminLimiter, async (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const rows = await readEngagementRows(10000);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="engagement-visits.csv"');
    return res.send(`${buildCsv(rows)}\n`);
  } catch (error) {
    console.error('Failed to export engagement CSV:', error.message);
    return res.status(503).json({ message: 'Engagement store unavailable.' });
  }
});

app.get('/admin/engagement', adminLimiter, async (req, res) => {
  // First visit with ?token=… trades the token for a short-lived HttpOnly
  // cookie and redirects to a clean URL, so it never stays in the address bar,
  // history, or Referer headers.
  if (typeof req.query.token === 'string' && isAdminToken(req.query.token)) {
    res.cookie(ADMIN_COOKIE, req.query.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });
    res.setHeader('Referrer-Policy', 'no-referrer');
    return res.redirect(303, '/admin/engagement');
  }

  if (!isAdminRequest(req)) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const rows = await readEngagementRows();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(renderEngagementDashboard(rows));
  } catch (error) {
    console.error('Failed to render engagement dashboard:', error.message);
    return res.status(503).send('Engagement store unavailable.');
  }
});

const ENQUIRY_SOURCES = new Set([
  'Quick availability enquiry',
  'Reservation rail enquiry',
  'Floating enquiry drawer',
  'Contact form enquiry',
]);

app.post('/api/enquiry', enquiryLimiter, async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (typeof body.website === 'string' && body.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  // Explicit consent and the 18+/guardian declaration are mandatory.
  if (body.consent !== 'yes' || body.ageConfirmed !== 'yes') {
    return res.status(400).json({ message: 'Consent is required to send an enquiry.' });
  }

  const clean = cleanEnquiry(body);
  const source = ENQUIRY_SOURCES.has(body.source) ? body.source : 'Website enquiry';
  const { name, phone } = clean;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required.' });
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ message: 'Please enter a valid phone number.' });
  }
  if (clean.email && !EMAIL_RE.test(clean.email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  for (const key of ['checkIn', 'checkOut']) {
    if (clean[key] && !DATE_RE.test(clean[key])) {
      return res.status(400).json({ message: 'Please enter valid dates.' });
    }
  }

  const resend = getResendClient();
  if (!resend) {
    // Not configured — the client falls back to the WhatsApp click-to-chat link.
    console.error('Enquiry not sent — RESEND_API_KEY is not set (apphosting.yaml / Secret Manager).');
    return res.status(503).json({ message: 'Unable to send enquiry right now.' });
  }

  try {
    const from = process.env.RESEND_FROM || 'Hotel Royal Fort <onboarding@resend.dev>';
    const formattedText = formatEnquiry({
      ...clean,
      consent: `given ${new Date().toISOString()} (18+ or guardian confirmed)`,
    });

    const { data, error } = await resend.emails.send({
      from,
      to: enquiryToEmail,
      replyTo: clean.email || undefined,
      subject: `${source}: ${name}`,
      text: formattedText,
      html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Website Enquiry</h2>
        <pre style="background: #f7fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 14px; white-space: pre-wrap;">${escapeHtmlPreserveLines(formattedText)}</pre>
      </div>`,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (error) {
    console.error('Failed to send enquiry email:', error);
    return res.status(500).json({ message: 'Unable to send enquiry right now.' });
  }
});

/** Liveness probe plus a quick way to see whether config actually landed. */
app.get('/api/health', (req, res) => {
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return res.json({
    ok: true,
    mailConfigured: resendConfigured,
    mailProvider: resendConfigured ? 'resend' : 'none',
    engagementConfigured: Boolean(engagementAdminToken),
  });
});

// Hashed assets (JS/CSS) — safe to cache for a year since filenames change on each build
app.use('/assets', express.static(path.join(distDir, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// Other static files (images, favicon, etc.) — short cache
app.use(express.static(distDir, {
  index: false, // Let the catch-all below serve index.html with no-cache headers
  maxAge: '1h',
}));

// SPA entry point — must never be cached so the browser always gets the latest index.html
const seoConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src', 'data', 'seo-pages.json'), 'utf8'),
);
const pagesByPath = new Map(Object.entries(seoConfig.pages).map(([id, page]) => [page.path, { id, ...page }]));
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || '';

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let htmlTemplate = null;
function getTemplate() {
  if (!htmlTemplate) htmlTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  return htmlTemplate;
}

/**
 * The SPA shell, with this URL's own title, description, canonical and share
 * tags written into the HTML. Crawlers and link-preview scrapers read the raw
 * HTML, so every page needs its own head before any JavaScript runs.
 */
function renderPage(page) {
  const url = `${seoConfig.siteUrl}${page ? page.path : '/'}`;
  let html = getTemplate();
  const swap = (pattern, replacement) => {
    html = html.replace(pattern, () => replacement);
  };

  if (page) {
    const t = escapeAttr(page.title);
    const d = escapeAttr(page.description);
    swap(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
    swap(/<meta name="description"[^>]*>/, `<meta name="description" content="${d}" />`);
    swap(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(url)}" />`);
    swap(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`);
    swap(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`);
    swap(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeAttr(url)}" />`);
    swap(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`);
    swap(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${d}" />`);
  } else {
    // Unknown address: never index it, and never claim a canonical.
    swap(/<title>[\s\S]*?<\/title>/, '<title>Page not found | Hotel Royal Fort</title>');
    swap(/<link rel="canonical"[^>]*>/, '');
    swap(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex" />');
  }

  const extra = [];
  if (googleVerification) {
    extra.push(`<meta name="google-site-verification" content="${escapeAttr(googleVerification)}" />`);
  }
  if (page && page.id !== 'home') {
    extra.push(
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${seoConfig.siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: page.name, item: url },
        ],
      })}</script>`,
    );
  }
  if (extra.length) swap('</head>', `    ${extra.join('\n    ')}\n  </head>`);

  // Plain-HTML fallback for crawlers and visitors without JavaScript.
  const links = [...pagesByPath.values()]
    .map((p) => `<li><a href="${p.path}">${escapeHtml(p.name)}</a></li>`)
    .join('');
  const heading = page && page.id !== 'home' ? page.name : 'Hotel Royal Fort, Ballari';
  const blurb = page ? page.description : 'This page could not be found.';
  swap(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(blurb)}</p><nav><ul>${links}</ul></nav></noscript>`,
  );
  return html;
}

app.get('*', (req, res) => {
  // Old ?page=rooms addresses become /rooms with a permanent redirect, so
  // search engines consolidate onto one URL per page.
  const legacy = typeof req.query.page === 'string' ? seoConfig.pages[req.query.page] : null;
  if (req.path === '/' && legacy) {
    return res.redirect(301, legacy.path === '/' ? '/' : legacy.path);
  }

  // /rooms/ and /Rooms are the same page as /rooms; send crawlers to the one true URL.
  const normalised = req.path.length > 1 ? req.path.replace(/\/+$/, '').toLowerCase() : req.path;
  const page = pagesByPath.get(normalised);
  if (page && normalised !== req.path) return res.redirect(301, page.path);

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(page ? 200 : 404).send(renderPage(page));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Hotel Royal Fort server listening on port ${port}`);
  // Clear expired analytics shortly after start-up, then on a timer while alive.
  setTimeout(schedulePurge, 30 * 1000).unref();
  setInterval(schedulePurge, PURGE_INTERVAL_MS).unref();
});
