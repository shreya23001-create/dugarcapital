// Vercel serverless function: POST /api/admin-upload  (raw image bytes, Content-Type: application/octet-stream)
import { handleUpload } from '../server/blogs.mjs';

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  const { status, json } = await handleUpload({ body: await readBody(req), cookieHeader: req.headers.cookie, env: process.env });
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(json);
}
