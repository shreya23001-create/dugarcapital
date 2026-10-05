// Vercel serverless function: POST /api/admin  { action: login | logout | session | list | save | remove }
import { handleAdmin } from '../server/blogs.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  // JSON only: a cross-site <form> post can't send this, which blocks CSRF alongside SameSite=Strict
  if (!String(req.headers['content-type'] ?? '').includes('application/json')) {
    return res.status(415).json({ ok: false });
  }
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  const { status, json, setCookie } = await handleAdmin({ body: req.body, cookieHeader: req.headers.cookie, ip, env: process.env });
  if (setCookie) res.setHeader('Set-Cookie', setCookie);
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(json);
}
