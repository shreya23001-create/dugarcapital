// Shared contact-form logic, used by the local Express server (server/index.mjs)
// and the Vercel serverless function (api/contact.mjs).
import nodemailer from 'nodemailer';
import { saveEnquiry } from './blogs.mjs';

export const REQUIRED_ENV = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'CONTACT_TO'];

export const missingEnv = env => REQUIRED_ENV.filter(k => !env[k]);

export function createTransporter(env) {
  const port = Number(env.SMTP_PORT);
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
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

// small in-memory limiter: 5 submissions per IP per 10 minutes (per server instance)
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

let cached;
const getTransporter = env => (cached ??= createTransporter(env));

/** Returns { status, json } for the HTTP layer to send. */
export async function handleContact({ body, ip, env }) {
  body = body ?? {};

  // honeypot: real visitors never see or fill this field; bots do
  if (body.website) return { status: 200, json: { ok: true } };

  if (missingEnv(env).length) {
    console.error('Mail settings missing:', missingEnv(env).join(', '));
    return { status: 500, json: { ok: false, message: 'The contact form is not available right now. Please email us directly.' } };
  }

  if (limited(ip)) return { status: 429, json: { ok: false, message: 'Too many messages. Please try again later.' } };

  const { values, errors } = validate(body);
  if (Object.keys(errors).length) return { status: 400, json: { ok: false, errors } };

  const { name, email, mobile, company, message } = values;

  // keep a copy for the admin panel (best effort: a storage problem must never block the email)
  await saveEnquiry(env, values);
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Mobile Number', mobile],
    ['Company Name', company || '-'],
    ['Message', message],
  ];

  try {
    await getTransporter(env).sendMail({
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
    return { status: 200, json: { ok: true } };
  } catch (err) {
    console.error('Mail send failed:', err.message);
    return { status: 502, json: { ok: false, message: 'We could not send your message right now. Please try again shortly.' } };
  }
}
