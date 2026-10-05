// Vercel serverless function: GET /api/blogs  (published posts only)  and  GET /api/blogs?slug=...
import { handlePublicBlogs } from '../server/blogs.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false });
  }
  const { status, json } = await handlePublicBlogs({ query: req.query, env: process.env });
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(json);
}
