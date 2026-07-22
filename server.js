import express from 'express';
import { Resend } from 'resend';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 8080;
const distDir = path.join(__dirname, 'dist');
const enquiryToEmail = process.env.ENQUIRY_TO_EMAIL || 'gmroyalfort@gmail.com';
const engagementAdminToken = process.env.ENGAGEMENT_ADMIN_TOKEN;
const engagementIpSalt = process.env.ENGAGEMENT_IP_SALT || 'hotel-royal-fort-engagement';
const ENGAGEMENT_COLLECTION = 'engagementVisits';

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
      // On App Hosting the runtime service account is picked up automatically.
      initializeApp({ credential: applicationDefault() });
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

function formatEnquiry(body) {
  return Object.entries(body)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

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

function getAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return req.query.token;
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

function renderEngagementDashboard(rows, token) {
  const sortedRows = [...rows].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const totalVisits = rows.length;
  const preciseLocations = rows.filter((row) => row.location_status === 'granted').length;
  const uniqueVisitors = new Set(rows.map((row) => row.ip_hash).filter(Boolean)).size;
  const todayPrefix = new Date().toISOString().slice(0, 10);
  const todayVisits = rows.filter((row) => row.created_at?.startsWith(todayPrefix)).length;
  const csvUrl = `/api/engagement/visits.csv?token=${encodeURIComponent(token || '')}`;

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

app.post('/api/engagement/visit', async (req, res) => {
  const now = new Date().toISOString();
  const body = req.body || {};
  const visitId = crypto.randomUUID();

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

  if (!visitId || !page) {
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

  if (!visitId) {
    return res.status(400).json({ message: 'visitId is required.' });
  }

  const safeStatus = ['granted', 'denied', 'unavailable', 'error', 'unsupported'].includes(status)
    ? status
    : 'error';
  const granted = safeStatus === 'granted';
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

app.get('/api/engagement/visits.csv', async (req, res) => {
  if (!engagementAdminToken || getAuthToken(req) !== engagementAdminToken) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const rows = await readEngagementRows(10000);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="engagement-visits.csv"');
    return res.send(`${buildCsv(rows)}\n`);
  } catch (error) {
    console.error('Failed to export engagement CSV:', error.message);
    return res.status(503).json({ message: 'Engagement store unavailable.' });
  }
});

app.get('/admin/engagement', async (req, res) => {
  const token = getAuthToken(req);

  if (!engagementAdminToken || token !== engagementAdminToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const rows = await readEngagementRows();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(renderEngagementDashboard(rows, token));
  } catch (error) {
    console.error('Failed to render engagement dashboard:', error.message);
    return res.status(503).send('Engagement store unavailable.');
  }
});

app.post('/api/enquiry', async (req, res) => {
  const { name, phone, source = 'Website enquiry' } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required.' });
  }

  const resend = getResendClient();
  if (!resend) {
    // Not configured — the client falls back to the WhatsApp click-to-chat link.
    console.error('Enquiry not sent — RESEND_API_KEY is not set (apphosting.yaml / Secret Manager).');
    return res.status(503).json({ message: 'Unable to send enquiry right now.' });
  }

  try {
    const from = process.env.RESEND_FROM || 'Hotel Royal Fort <onboarding@resend.dev>';
    const formattedText = formatEnquiry(req.body);

    const { data, error } = await resend.emails.send({
      from,
      to: enquiryToEmail,
      replyTo: req.body.email || undefined,
      subject: `${source}: ${name}`,
      text: formattedText,
      html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Website Enquiry</h2>
        <pre style="background: #f7fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 14px; white-space: pre-wrap;">${formattedText}</pre>
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
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Hotel Royal Fort server listening on port ${port}`);
});
