// Local / self-hosted server: serves the contact API (and the built site if /dist exists).
// SMTP credentials live ONLY in server/.env - never in the Angular bundle, which is public.
// On Vercel the same logic runs as a serverless function: see /api/contact.mjs.
//
//   npm run server          -> API on http://localhost:3000 (use with `npm start` + proxy.conf.json)
//   npm run server:verify   -> checks the SMTP login and exits, sends nothing
//   npm run serve:prod      -> builds the site, then serves it and the API together
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import { config } from 'dotenv';
import { createTransporter, handleContact, missingEnv } from './contact.mjs';
import { handleAdmin, handleImage, handlePublicBlogs, handleUpload } from './blogs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(here, '.env'), quiet: true });

const env = process.env;
const missing = missingEnv(env);
if (missing.length) {
  console.error(`Missing settings in server/.env: ${missing.join(', ')}`);
  process.exit(1);
}

if (process.argv.includes('--verify')) {
  try {
    await createTransporter(env).verify();
    console.log(`SMTP login OK (${env.SMTP_HOST}:${env.SMTP_PORT}). Nothing was sent.`);
    process.exit(0);
  } catch (err) {
    console.error('SMTP login FAILED:', err.message);
    process.exit(1);
  }
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  const { status, json } = await handleContact({ body: req.body, ip: req.ip, env });
  res.status(status).json(json);
});

app.get('/api/blogs', async (req, res) => {
  const { status, json } = await handlePublicBlogs({ query: req.query, env });
  res.set('Cache-Control', 'no-store').status(status).json(json);
});

app.post('/api/admin', async (req, res) => {
  if (!req.is('application/json')) return res.status(415).json({ ok: false });
  const { status, json, setCookie } = await handleAdmin({ body: req.body, cookieHeader: req.headers.cookie, ip: req.ip, env });
  if (setCookie) res.set('Set-Cookie', setCookie);
  res.set('Cache-Control', 'no-store').status(status).json(json);
});

app.post('/api/admin-upload', express.raw({ type: 'application/octet-stream', limit: '4mb' }), async (req, res) => {
  const { status, json } = await handleUpload({ body: req.body, cookieHeader: req.headers.cookie, env });
  res.set('Cache-Control', 'no-store').status(status).json(json);
});

app.get('/api/blog-image', async (req, res) => {
  const r = await handleImage({ query: req.query, env });
  if (r.status !== 200) return res.sendStatus(r.status);
  res.set({ 'Content-Type': r.contentType, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' }).send(r.body);
});

// Production: serve the built Angular app from the same server (SPA fallback to index.html)
const dist = path.resolve(here, '../dist/dugar-capital/browser');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const listenPort = Number(env.PORT) || 3000;
app.listen(listenPort, () => console.log(`Server running on http://localhost:${listenPort}`));
