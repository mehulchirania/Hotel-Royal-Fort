import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 8080;
const distDir = path.join(__dirname, 'dist');
const enquiryToEmail = process.env.ENQUIRY_TO_EMAIL || 'gmroyalfort@gmail.com';

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

app.use(express.json({ limit: '20kb' }));

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
