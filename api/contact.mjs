// Vercel serverless function for POST /api/contact.
// SMTP settings come from the project's Environment Variables in Vercel (never from the repo).
import { handleContact } from '../server/contact.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  const { status, json } = await handleContact({ body: req.body, ip, env: process.env });
  res.status(status).json(json);
}
