import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface AdminPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  date: string; // YYYY-MM-DD
  image: string;
}

export interface Enquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  mobile: string;
  company: string;
  message: string;
}

export type ApiResult = { status: number; ok?: boolean; message?: string; errors?: Record<string, string>; [key: string]: any };

export const formatDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

/** One place for everything the admin portal needs from the server: session, posts and enquiries. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly router = inject(Router);

  /** short confirmation message shown at the top of the admin pages */
  readonly flash = signal('');
  /** false when the server has no admin credentials set up */
  readonly configured = signal(true);
  private flashTimer?: ReturnType<typeof setTimeout>;

  notify(message: string) {
    clearTimeout(this.flashTimer);
    this.flash.set(message);
    this.flashTimer = setTimeout(() => this.flash.set(''), 5000);
  }

  dismissFlash() {
    clearTimeout(this.flashTimer);
    this.flash.set('');
  }

  async call(body: object): Promise<ApiResult> {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      const result: ApiResult = { status: res.status, ...json };
      // session expired: go back to the login page
      if (res.status === 401 && (body as { action?: string }).action !== 'login') this.router.navigate(['/admin/login']);
      return result;
    } catch {
      return { status: 0, ok: false, message: 'Could not reach the server.' };
    }
  }

  async check(): Promise<boolean> {
    const r = await this.call({ action: 'session' });
    this.configured.set(r.status !== 503);
    return !!r['loggedIn'];
  }

  login(username: string, password: string) {
    return this.call({ action: 'login', username, password });
  }

  async logout() {
    await this.call({ action: 'logout' });
    this.dismissFlash();
    this.router.navigate(['/admin/login']);
  }

  async listPosts(): Promise<AdminPost[] | null> {
    const r = await this.call({ action: 'list' });
    return r.ok ? r['posts'] : null;
  }

  async listEnquiries(): Promise<Enquiry[] | null> {
    const r = await this.call({ action: 'contacts' });
    return r.ok ? r['contacts'] : null;
  }
}
