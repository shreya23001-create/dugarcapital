// Blog storage + admin API logic, shared by the local Express server (server/index.mjs)
// and the Vercel serverless functions (api/blogs.mjs, api/admin.mjs).
//
// Storage: Vercel Blob (private) in production, a JSON file in server/data/ for local development.
// Auth: a single admin account from env (ADMIN_USER / ADMIN_PASSWORD) -> signed, HttpOnly session cookie.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_FILE = path.join(here, 'data', 'blogs.json');
const BLOB_PATH = 'blogs/posts.json';

const COOKIE = 'dc_admin';
const SESSION_HOURS = 8;
const RESERVED_SLUGS = ['about', 'services', 'testimonials', 'contact', 'blogs', 'admin', 'api'];

// Posts that existed before the admin panel; used to seed an empty store.
const SEED = [
  {
    slug: 'how-an-ipo-can-transform-your-business',
    title: 'How an IPO Can Transform Your Business',
    date: '2024-12-19',
    excerpt: "An IPO is more than just a financial milestone—it's a transformational step that can redefine a company's future.",
  },
  {
    slug: 'top-5-reasons-your-business-should-consider-an-ipo',
    title: 'Top 5 Reasons Your Business Should Consider an IPO',
    date: '2024-12-19',
    excerpt: 'Deciding to take your business public is a big step, but it can also be the most rewarding one.',
  },
  {
    slug: 'what-is-an-ipo-and-why-does-your-business-need-one',
    title: 'What is an IPO and Why Does Your Business Need One?',
    date: '2024-12-19',
    excerpt: 'When a company decides to go public, it embarks on a transformative journey through an Initial Public Offering.',
  },
].map(p => ({ ...p, content: '', image: 'images/about/business-charts-review.jpg', status: 'published', updatedAt: new Date().toISOString() }));

/* ---------- storage ---------- */

const useBlob = env => Boolean(env.BLOB_READ_WRITE_TOKEN);

// Generic JSON storage: Vercel Blob in production, a file under server/data in development
async function readRaw(env, blobPath, localFile) {
  if (useBlob(env)) {
    const { get } = await import('@vercel/blob');
    const res = await get(blobPath, { access: 'private', token: env.BLOB_READ_WRITE_TOKEN, useCache: false });
    return res?.statusCode === 200 ? await new Response(res.stream).text() : null;
  }
  return fs.readFile(localFile, 'utf8').catch(() => null);
}

async function writeRaw(env, blobPath, localFile, data) {
  const json = JSON.stringify(data, null, 2);
  if (useBlob(env)) {
    const { put } = await import('@vercel/blob');
    await put(blobPath, json, {
      access: 'private',
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType: 'application/json',
      allowOverwrite: true,
      addRandomSuffix: false,
      cacheControlMaxAge: 60,
    });
  } else {
    await fs.mkdir(path.dirname(localFile), { recursive: true });
    await fs.writeFile(localFile, json);
  }
}

async function readAll(env) {
  const raw = await readRaw(env, BLOB_PATH, LOCAL_FILE);
  if (raw === null) {
    await writeAll(env, SEED); // first run: seed with the original three posts
    return structuredClone(SEED);
  }
  return JSON.parse(raw);
}

const writeAll = (env, posts) => writeRaw(env, BLOB_PATH, LOCAL_FILE, posts);

/* ---------- contact enquiries ---------- */

const CONTACTS_BLOB = 'contacts/messages.json';
const CONTACTS_FILE = path.join(here, 'data', 'contacts.json');
const MAX_ENQUIRIES = 1000;

async function readEnquiries(env) {
  const raw = await readRaw(env, CONTACTS_BLOB, CONTACTS_FILE);
  return raw === null ? [] : JSON.parse(raw);
}

/** Keep a copy of every contact-form submission so it can be read in the admin panel. Never throws. */
export async function saveEnquiry(env, { name, email, mobile, company, message }) {
  try {
    const list = await readEnquiries(env);
    list.unshift({ id: randomBytes(6).toString('hex'), createdAt: new Date().toISOString(), name, email, mobile, company, message });
    await writeRaw(env, CONTACTS_BLOB, CONTACTS_FILE, list.slice(0, MAX_ENQUIRIES));
  } catch (err) {
    console.error('Could not store enquiry:', err.message);
  }
}

/* ---------- uploaded cover images ---------- */

const UPLOAD_DIR = path.join(here, 'data', 'uploads');
const IMAGE_TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

// identify the real file type from its first bytes (never trust the browser's label)
function sniffImage(buf) {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length > 12 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'webp';
  return null;
}

async function storeImage(env, name, buf, contentType) {
  if (useBlob(env)) {
    const { put } = await import('@vercel/blob');
    await put(`blogs/images/${name}`, buf, { access: 'private', token: env.BLOB_READ_WRITE_TOKEN, contentType, addRandomSuffix: false, allowOverwrite: false });
  } else {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  }
}

async function loadImage(env, name) {
  if (useBlob(env)) {
    const { get } = await import('@vercel/blob');
    const res = await get(`blogs/images/${name}`, { access: 'private', token: env.BLOB_READ_WRITE_TOKEN, useCache: false });
    return res?.statusCode === 200 ? Buffer.from(await new Response(res.stream).arrayBuffer()) : null;
  }
  return fs.readFile(path.join(UPLOAD_DIR, name)).catch(() => null);
}

/* ---------- session cookie ---------- */

const b64 = buf => Buffer.from(buf).toString('base64url');
const sign = (payload, secret) => createHmac('sha256', secret).update(payload).digest('base64url');

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

function makeToken(secret) {
  const payload = b64(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600_000, n: randomBytes(8).toString('hex') }));
  return `${payload}.${sign(payload, secret)}`;
}

function validToken(token, secret) {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!safeEqual(sig, sign(payload, secret))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

const parseCookies = header =>
  Object.fromEntries(
    String(header ?? '')
      .split(';')
      .map(c => c.trim().split(/=(.*)/s).slice(0, 2))
      .filter(([k]) => k)
  );

const cookieHeader = (value, maxAgeSeconds, env) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${env.VERCEL || env.NODE_ENV === 'production' ? '; Secure' : ''}`;

// brute-force guard: 8 WRONG passwords per IP per 15 minutes (per server instance).
// Successful sign-ins are not counted, and one clears the count.
const failedLogins = new Map();
const recentFailures = ip => {
  const now = Date.now();
  const recent = (failedLogins.get(ip) ?? []).filter(t => now - t < 15 * 60_000);
  failedLogins.set(ip, recent);
  return recent;
};

/* ---------- validation ---------- */

const slugify = s =>
  String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);

function cleanPost(input, existing, all) {
  const errors = {};
  const title = String(input.title ?? '').trim();
  const excerpt = String(input.excerpt ?? '').trim();
  const content = String(input.content ?? '').replace(/\u0000/g, '').trim();
  const status = input.status === 'published' ? 'published' : 'draft';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input.date ?? '') ? input.date : new Date().toISOString().slice(0, 10);
  const image = String(input.image ?? '').trim() || 'images/about/business-charts-review.jpg';
  let slug = slugify(input.slug || title);

  if (!title || title.length > 200) errors.title = 'Title is required (max 200 characters).';
  if (!excerpt || excerpt.length > 400) errors.excerpt = 'Short summary is required (max 400 characters).';
  if (content.length > 50_000) errors.content = 'Article is too long.';
  if (status === 'published' && content.length < 20) errors.content = 'Write the article before publishing.';
  if (!/^(images\/[A-Za-z0-9_\-./]+|\/api\/blog-image\?f=[A-Za-z0-9._-]+|https:\/\/[^\s"'<>()]+)$/.test(image)) errors.image = 'Image must be an uploaded photo or an https:// link.';
  if (!slug) errors.slug = 'Could not create a URL from the title.';
  else if (RESERVED_SLUGS.includes(slug)) errors.slug = `"${slug}" is reserved. Please use a different URL.`;
  else if (all.some(p => p.slug === slug && p.slug !== existing?.slug)) errors.slug = 'Another post already uses this URL.';

  return { errors, post: { slug, title, excerpt, content, status, date, image, updatedAt: new Date().toISOString() } };
}

const publicView = ({ slug, title, excerpt, content, date, image }) => ({ slug, title, excerpt, content, date, image });
const byDateDesc = (a, b) => (b.date + b.updatedAt).localeCompare(a.date + a.updatedAt);

/* ---------- handlers: return { status, json, setCookie? } ---------- */

/** Public: only published posts. */
export async function handlePublicBlogs({ query, env }) {
  try {
    const published = (await readAll(env)).filter(p => p.status === 'published').sort(byDateDesc);
    if (query?.slug) {
      const post = published.find(p => p.slug === query.slug);
      return post ? { status: 200, json: { ok: true, post: publicView(post) } } : { status: 404, json: { ok: false } };
    }
    return { status: 200, json: { ok: true, posts: published.map(publicView) } };
  } catch (err) {
    console.error('Blogs read failed:', err.message);
    return { status: 500, json: { ok: false, message: 'Could not load blogs.' } };
  }
}

export const adminConfigured = env => Boolean(env.ADMIN_USER && env.ADMIN_PASSWORD && env.ADMIN_SECRET);

/** Admin actions (login / session / list / save / remove / logout). */
export async function handleAdmin({ body, cookieHeader: ch, ip, env }) {
  if (!adminConfigured(env)) return { status: 503, json: { ok: false, message: 'Admin is not configured.' } };
  body = body ?? {};
  const action = body.action;

  if (action === 'login') {
    if (recentFailures(ip).length >= 8) return { status: 429, json: { ok: false, message: 'Too many wrong attempts. Please try again in 15 minutes.' } };
    // compare both fields every time so response timing doesn't reveal which was wrong
    const okUser = safeEqual(body.username ?? '', env.ADMIN_USER);
    const okPass = safeEqual(body.password ?? '', env.ADMIN_PASSWORD);
    if (!(okUser && okPass)) {
      recentFailures(ip).push(Date.now());
      return { status: 401, json: { ok: false, message: 'Incorrect username or password.' } };
    }
    failedLogins.delete(ip);
    return { status: 200, json: { ok: true }, setCookie: cookieHeader(makeToken(env.ADMIN_SECRET), SESSION_HOURS * 3600, env) };
  }

  if (action === 'logout') return { status: 200, json: { ok: true }, setCookie: cookieHeader('', 0, env) };

  const loggedIn = validToken(parseCookies(ch)[COOKIE], env.ADMIN_SECRET);
  if (action === 'session') return { status: 200, json: { ok: true, loggedIn } };
  if (!loggedIn) return { status: 401, json: { ok: false, message: 'Please log in.' } };

  try {
    const all = await readAll(env);

    if (action === 'list') return { status: 200, json: { ok: true, posts: [...all].sort(byDateDesc) } };

    if (action === 'contacts') return { status: 200, json: { ok: true, contacts: await readEnquiries(env) } };

    if (action === 'removeContact') {
      const list = await readEnquiries(env);
      if (!list.some(c => c.id === body.id)) return { status: 404, json: { ok: false, message: 'Enquiry not found.' } };
      await writeRaw(env, CONTACTS_BLOB, CONTACTS_FILE, list.filter(c => c.id !== body.id));
      return { status: 200, json: { ok: true } };
    }

    if (action === 'save') {
      const existing = body.originalSlug ? all.find(p => p.slug === body.originalSlug) : null;
      if (body.originalSlug && !existing) return { status: 404, json: { ok: false, message: 'Post not found.' } };
      const { errors, post } = cleanPost(body.post ?? {}, existing, all);
      if (Object.keys(errors).length) return { status: 400, json: { ok: false, errors } };
      const next = existing ? all.map(p => (p.slug === existing.slug ? post : p)) : [post, ...all];
      await writeAll(env, next);
      return { status: 200, json: { ok: true, post } };
    }

    if (action === 'remove') {
      if (!all.some(p => p.slug === body.slug)) return { status: 404, json: { ok: false, message: 'Post not found.' } };
      await writeAll(env, all.filter(p => p.slug !== body.slug));
      return { status: 200, json: { ok: true } };
    }

    return { status: 400, json: { ok: false, message: 'Unknown action.' } };
  } catch (err) {
    console.error('Admin action failed:', err.message);
    return { status: 500, json: { ok: false, message: 'Something went wrong. Please try again.' } };
  }
}

/** Admin: upload a cover image (raw bytes in the request body). */
export async function handleUpload({ body, cookieHeader: ch, env }) {
  if (!adminConfigured(env)) return { status: 503, json: { ok: false, message: 'Admin is not configured.' } };
  if (!validToken(parseCookies(ch)[COOKIE], env.ADMIN_SECRET)) return { status: 401, json: { ok: false, message: 'Please log in.' } };
  if (!Buffer.isBuffer(body) || !body.length) return { status: 400, json: { ok: false, message: 'No image received.' } };
  if (body.length > MAX_IMAGE_BYTES) return { status: 413, json: { ok: false, message: 'Image is too large (max 4 MB).' } };

  const ext = sniffImage(body);
  if (!ext) return { status: 415, json: { ok: false, message: 'Please upload a JPG, PNG or WebP image.' } };

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${ext}`;
  try {
    await storeImage(env, name, body, IMAGE_TYPES[ext]);
    return { status: 200, json: { ok: true, url: `/api/blog-image?f=${name}` } };
  } catch (err) {
    console.error('Image upload failed:', err.message);
    return { status: 500, json: { ok: false, message: 'Could not save the image. Please try again.' } };
  }
}

/** Public: serve an uploaded cover image. File names are random and never reused, so they can be cached forever. */
export async function handleImage({ query, env }) {
  const name = String(query?.f ?? '');
  if (!/^[A-Za-z0-9-]{8,60}\.(jpg|png|webp)$/.test(name)) return { status: 404 };
  try {
    const buf = await loadImage(env, name);
    if (!buf) return { status: 404 };
    return { status: 200, body: buf, contentType: IMAGE_TYPES[name.split('.').pop()] };
  } catch (err) {
    console.error('Image read failed:', err.message);
    return { status: 404 };
  }
}
