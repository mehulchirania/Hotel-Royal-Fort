import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 8080;
const distDir = path.join(__dirname, 'dist');
const enquiryToEmail = process.env.ENQUIRY_TO_EMAIL || 'gmroyalfort@gmail.com';
const engagementDir = path.join(__dirname, 'data');
const engagementCsvPath = path.join(engagementDir, 'engagement-visits.csv');
const engagementAdminToken = process.env.ENGAGEMENT_ADMIN_TOKEN;
const engagementIpSalt = process.env.ENGAGEMENT_IP_SALT || 'hotel-royal-fort-engagement';

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

function getTransporter() {
  const requiredKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingKey = requiredKeys.find((key) => !process.env[key]);

  if (missingKey) {
    throw new Error(`Missing mail configuration: ${missingKey}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
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

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function ensureEngagementTable() {
  fs.mkdirSync(engagementDir, { recursive: true });
  if (!fs.existsSync(engagementCsvPath)) {
    fs.writeFileSync(engagementCsvPath, `${ENGAGEMENT_HEADERS.join(',')}\n`, 'utf8');
  }
}

function rowToCsv(row) {
  return ENGAGEMENT_HEADERS.map((header) => csvEscape(row[header])).join(',');
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

function readEngagementRows() {
  ensureEngagementTable();
  const lines = fs.readFileSync(engagementCsvPath, 'utf8').trimEnd().split('\n');
  const headers = parseCsvLine(lines[0] || '');
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || '';
      return row;
    }, {});
  });
}

function writeEngagementRows(rows) {
  ensureEngagementTable();
  const content = [
    ENGAGEMENT_HEADERS.join(','),
    ...rows.map((row) => rowToCsv(row)),
  ].join('\n');
  fs.writeFileSync(engagementCsvPath, `${content}\n`, 'utf8');
}

function appendEngagementRow(row) {
  ensureEngagementTable();
  fs.appendFileSync(engagementCsvPath, `${rowToCsv(row)}\n`, 'utf8');
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

app.post('/api/engagement/visit', (req, res) => {
  const now = new Date().toISOString();
  const body = req.body || {};
  const visitId = crypto.randomUUID();

  appendEngagementRow({
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
});

app.post('/api/engagement/page', (req, res) => {
  const { visitId, page } = req.body || {};

  if (!visitId || !page) {
    return res.status(400).json({ message: 'visitId and page are required.' });
  }

  const rows = readEngagementRows();
  const row = rows.find((entry) => entry.visit_id === visitId);

  if (!row) {
    return res.status(404).json({ message: 'Visit was not found.' });
  }

  const now = new Date().toISOString();
  const pages = row.pages_visited ? row.pages_visited.split('|') : [];
  pages.push(sanitizeCell(page, 80));

  row.current_page = page;
  row.pages_visited = pages.join('|').slice(0, 1000);
  row.last_page_at = now;
  row.last_updated_at = now;

  writeEngagementRows(rows);
  return res.status(200).json({ ok: true });
});

app.post('/api/engagement/location', (req, res) => {
  const { visitId, status, latitude, longitude, accuracy } = req.body || {};

  if (!visitId) {
    return res.status(400).json({ message: 'visitId is required.' });
  }

  const safeStatus = ['granted', 'denied', 'unavailable', 'error', 'unsupported'].includes(status)
    ? status
    : 'error';
  const rows = readEngagementRows();
  const row = rows.find((entry) => entry.visit_id === visitId);

  if (!row) {
    return res.status(404).json({ message: 'Visit was not found.' });
  }

  row.last_updated_at = new Date().toISOString();
  row.location_status = safeStatus;
  row.latitude = safeStatus === 'granted' ? latitude : '';
  row.longitude = safeStatus === 'granted' ? longitude : '';
  row.location_accuracy_m = safeStatus === 'granted' ? accuracy : '';
  row.location_captured_at = safeStatus === 'granted' ? row.last_updated_at : '';

  writeEngagementRows(rows);
  return res.status(200).json({ ok: true });
});

app.get('/api/engagement/visits.csv', (req, res) => {
  if (!engagementAdminToken || getAuthToken(req) !== engagementAdminToken) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  ensureEngagementTable();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="engagement-visits.csv"');
  return res.sendFile(engagementCsvPath);
});

app.get('/admin/engagement', (req, res) => {
  const token = getAuthToken(req);

  if (!engagementAdminToken || token !== engagementAdminToken) {
    return res.status(401).send('Unauthorized');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.send(renderEngagementDashboard(readEngagementRows(), token));
});

app.post('/api/enquiry', async (req, res) => {
  const { name, phone, source = 'Website enquiry' } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required.' });
  }

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Hotel Royal Fort Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: enquiryToEmail,
      replyTo: req.body.email || undefined,
      subject: `${source}: ${name}`,
      text: formatEnquiry(req.body),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to send enquiry email:', error);
    return res.status(500).json({ message: 'Unable to send enquiry right now.' });
  }
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
