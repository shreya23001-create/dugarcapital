// Contact-form mail server.
// SMTP credentials live ONLY here (server/.env) - never in the Angular bundle, which is public.
//
//   npm run server          -> API on http://localhost:3000 (use with `npm start` + proxy.conf.json)
//   npm run server:verify   -> checks the SMTP login and exits, sends nothing
//   npm run serve:prod      -> builds the site, then serves it and the API together
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(here, '.env'), quiet: true });

const env = process.env;
const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'CONTACT_TO'];
const missing = required.filter(k => !env[k]);
if (missing.length) {
  console.error(`Missing settings in server/.env: ${missing.join(', ')}`);
  process.exit(1);
}

const port = Number(env.SMTP_PORT);
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port,
  secure: port === 465, // 465 = SSL, 587 = STARTTLS
  requireTLS: port !== 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

if (process.argv.includes('--verify')) {
  try {
    await transporter.verify();
    console.log(`SMTP login OK (${env.SMTP_HOST}:${port}). Nothing was sent.`);
    process.exit(0);
  } catch (err) {
    console.error('SMTP login FAILED:', err.message);
    process.exit(1);
  }
}

const escapeHtml = s =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const oneLine = s => String(s ?? '').replace(/[\r\n\u0000-\u001f]+/g, ' ').trim();

function validate(body) {
  const name = oneLine(body.name);
  const email = oneLine(body.email);
  const mobile = oneLine(body.mobile);
  const company = oneLine(body.company);
  const message = String(body.message ?? '').replace(/\u0000/g, '').trim();
  const errors = {};

  if (!name || name.length > 100) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.email = 'Please enter a valid email address.';
  if (!/^[+()\-\s\d]{7,20}$/.test(mobile) || mobile.replace(/\D/g, '').length < 7) errors.mobile = 'Please enter a valid mobile number.';
  if (company.length > 150) errors.company = 'Company name is too long.';
  if (message.length < 5 || message.length > 3000) errors.message = 'Please enter a message (up to 3000 characters).';

  return { values: { name, email, mobile, company, message }, errors };
}

// very small in-memory limiter: 5 submissions per IP per 10 minutes
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  const body = req.body ?? {};

  // honeypot: real visitors never see or fill this field; bots do
  if (body.website) return res.json({ ok: true });

  if (limited(req.ip)) return res.status(429).json({ ok: false, message: 'Too many messages. Please try again later.' });

  const { values, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const { name, email, mobile, company, message } = values;
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Mobile Number', mobile],
    ['Company Name', company || '-'],
    ['Message', message],
  ];

  try {
    await transporter.sendMail({
      from: `"Dugar Capital Website" <${env.MAIL_FROM}>`,
      to: env.CONTACT_TO.split(',').map(s => s.trim()).filter(Boolean),
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `New enquiry from ${name} - Dugar Capital website`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="border:1px solid #ddd;background:#f7f7f7;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td>` +
            `<td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
        )
        .join('')}</table>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail send failed:', err.message);
    res.status(502).json({ ok: false, message: 'We could not send your message right now. Please try again shortly.' });
  }
});

// Production: serve the built Angular app from the same server (SPA fallback to index.html)
const dist = path.resolve(here, '../dist/dugar-capital/browser');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const listenPort = Number(env.PORT) || 3000;
app.listen(listenPort, () => console.log(`Server running on http://localhost:${listenPort}`));
