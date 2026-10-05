// Vercel serverless function: GET /api/blog-image?f=<file>  (serves uploaded blog cover images)
import { handleImage } from '../server/blogs.mjs';

export default async function handler(req, res) {
  const r = await handleImage({ query: req.query, env: process.env });
  if (r.status !== 200) return res.status(r.status).end();
  res.setHeader('Content-Type', r.contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).send(r.body);
}
