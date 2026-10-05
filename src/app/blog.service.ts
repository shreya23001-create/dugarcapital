import { Injectable, signal } from '@angular/core';
import { BLOGS, BlogPost } from './site-data';

interface ApiPost {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  image: string;
  content: string;
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Published blog posts, loaded from /api/blogs. Drafts are never sent to the browser. */
@Injectable({ providedIn: 'root' })
export class BlogService {
  /** null while loading */
  readonly posts = signal<BlogPost[] | null>(null);
  private pending?: Promise<void>;

  load(force = false): Promise<void> {
    if (!force && this.pending) return this.pending;
    this.pending = (async () => {
      try {
        const res = await fetch('/api/blogs', { cache: 'no-store' });
        const body = await res.json();
        if (!res.ok || !body.ok) throw new Error('bad response');
        this.posts.set((body.posts as ApiPost[]).map(p => ({ ...p, date: formatDate(p.date) })));
      } catch {
        // API unreachable (for example the dev server is running without the mail/blog server): show the original posts
        this.posts.set(BLOGS);
      }
    })();
    return this.pending;
  }
}
