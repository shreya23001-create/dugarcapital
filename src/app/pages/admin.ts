import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { BlogService } from '../blog.service';

interface AdminPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  date: string;
  image: string;
}

type View = 'checking' | 'login' | 'list' | 'edit';

const DEFAULT_IMAGE = 'images/about/business-charts-review.jpg';

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);

const today = () => new Date().toISOString().slice(0, 10);

/** Hidden admin page (not linked anywhere on the site): /admin */
@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly fb = inject(FormBuilder);
  private readonly blogs = inject(BlogService);
  private readonly meta = inject(Meta);

  protected readonly view = signal<View>('checking');
  protected readonly posts = signal<AdminPost[]>([]);
  protected readonly busy = signal(false);
  protected readonly message = signal('');
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly originalSlug = signal<string | null>(null);
  protected readonly slugTouched = signal(false);

  protected readonly showPassword = signal(false);
  protected readonly uploading = signal(false);
  protected readonly showLink = signal(false);
  protected readonly imageError = signal('');

  protected readonly loginForm = this.fb.nonNullable.group({ username: '', password: '' });

  protected readonly form = this.fb.nonNullable.group({
    title: '',
    slug: '',
    date: today(),
    status: 'draft' as 'draft' | 'published',
    excerpt: '',
    image: DEFAULT_IMAGE,
    content: '',
  });

  constructor() {
    // keep this page out of search engines
    this.meta.addTag({ name: 'robots', content: 'noindex,nofollow' });
    inject(DestroyRef).onDestroy(() => this.meta.removeTag("name='robots'"));

    // slug follows the title until the admin edits it by hand
    this.form.controls.title.valueChanges.pipe(takeUntilDestroyed()).subscribe(t => {
      if (!this.slugTouched()) this.form.controls.slug.setValue(slugify(t), { emitEvent: false });
    });

    this.checkSession();
  }

  protected useDefaultImage() {
    this.form.controls.image.setValue(DEFAULT_IMAGE);
    this.showLink.set(false);
    this.imageError.set('');
  }

  /** Shrink the photo in the browser (max 1600px wide, JPEG) so uploads are small and fast. */
  private async compress(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return new Promise((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('compress failed'))), 'image/jpeg', 0.85)
    );
  }

  protected async onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.imageError.set('');
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      this.imageError.set('Please choose a JPG, PNG or WebP image.');
      return;
    }
    this.uploading.set(true);
    try {
      const blob = await this.compress(file);
      const res = await fetch('/api/admin-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        credentials: 'same-origin',
        body: blob,
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
        this.view.set('login');
        return;
      }
      if (!res.ok || !json.ok) throw new Error(json.message ?? 'Upload failed.');
      this.form.controls.image.setValue(json.url);
      this.showLink.set(false);
    } catch (err) {
      this.imageError.set((err as Error).message || 'Could not upload the image.');
    } finally {
      this.uploading.set(false);
    }
  }

  private async call(body: object): Promise<{ status: number; [k: string]: any }> {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      return { status: res.status, ...json };
    } catch {
      return { status: 0, ok: false, message: 'Could not reach the server.' };
    }
  }

  private async checkSession() {
    const r = await this.call({ action: 'session' });
    if (r['status'] === 503) {
      this.message.set('Admin is not configured on the server yet.');
      this.view.set('login');
    } else if (r['loggedIn']) {
      await this.loadList();
    } else {
      this.view.set('login');
    }
  }

  protected async login() {
    this.busy.set(true);
    this.message.set('');
    const r = await this.call({ action: 'login', ...this.loginForm.getRawValue() });
    this.busy.set(false);
    if (r['ok']) {
      this.loginForm.reset();
      await this.loadList();
    } else {
      this.message.set(r['message'] ?? 'Could not sign in.');
    }
  }

  protected async logout() {
    await this.call({ action: 'logout' });
    this.posts.set([]);
    this.message.set('');
    this.view.set('login');
  }

  private async loadList() {
    const r = await this.call({ action: 'list' });
    if (r['status'] === 401) {
      this.view.set('login');
      return;
    }
    this.posts.set(r['posts'] ?? []);
    this.view.set('list');
  }

  protected newPost() {
    this.originalSlug.set(null);
    this.slugTouched.set(false);
    this.errors.set({});
    this.message.set('');
    this.imageError.set('');
    this.showLink.set(false);
    this.form.reset({ title: '', slug: '', date: today(), status: 'draft', excerpt: '', image: DEFAULT_IMAGE, content: '' });
    this.view.set('edit');
  }

  protected edit(p: AdminPost) {
    this.originalSlug.set(p.slug);
    this.slugTouched.set(true);
    this.errors.set({});
    this.message.set('');
    this.imageError.set('');
    this.showLink.set(false);
    this.form.reset({ ...p });
    this.view.set('edit');
  }

  protected cancel() {
    this.message.set('');
    this.view.set('list');
  }

  protected async save() {
    this.busy.set(true);
    this.errors.set({});
    this.message.set('');
    const r = await this.call({ action: 'save', originalSlug: this.originalSlug(), post: this.form.getRawValue() });
    this.busy.set(false);

    if (r['status'] === 401) return this.view.set('login');
    if (r['errors']) {
      this.errors.set(r['errors']);
      this.message.set('Please fix the highlighted fields.');
      return;
    }
    if (!r['ok']) {
      this.message.set(r['message'] ?? 'Could not save.');
      return;
    }
    const wasPublished = r['post'].status === 'published';
    await this.loadList();
    this.message.set(wasPublished ? 'Saved. This post is live on the website.' : 'Saved as a draft. It is not visible on the website.');
    this.blogs.load(true);
  }

  protected async remove(p: AdminPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const r = await this.call({ action: 'remove', slug: p.slug });
    if (r['status'] === 401) return this.view.set('login');
    await this.loadList();
    this.message.set(r['ok'] ? 'Post deleted.' : (r['message'] ?? 'Could not delete.'));
    this.blogs.load(true);
  }
}
