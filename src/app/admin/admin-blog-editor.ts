import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from './admin.service';

const DEFAULT_IMAGE = 'images/about/business-charts-review.jpg';

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);

const today = () => new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-admin-blog-editor',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/admin/blogs" class="back a-link">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
      Back to Blog Posts
    </a>

    @if (loading()) {
      <div class="a-card"><div class="a-card-body" aria-busy="true"><div class="a-skeleton"></div></div></div>
    } @else if (notFound()) {
      <div class="a-card"><div class="a-empty"><strong>Post not found</strong>It may have been deleted.</div></div>
    } @else {
      <form class="layout" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="col-main">
          <section class="a-card">
            <div class="a-card-head"><div><h2>Content</h2><p>The title, summary and article text.</p></div></div>
            <div class="a-card-body stack">
              <label class="a-field">Title
                <input class="a-input" type="text" formControlName="title" maxlength="200" [class.invalid]="errors()['title']" />
                @if (errors()['title']) { <span class="a-error">{{ errors()['title'] }}</span> }
              </label>

              <label class="a-field">Page URL
                <span class="slug-input">
                  <span class="prefix">dugarcapital.com/</span>
                  <input type="text" formControlName="slug" (input)="slugTouched.set(true)" maxlength="90" />
                </span>
                @if (errors()['slug']) { <span class="a-error">{{ errors()['slug'] }}</span> }
              </label>

              <label class="a-field">
                <span>Short summary <small class="a-hint">({{ form.controls.excerpt.value.length }}/400, shown on the blogs page)</small></span>
                <textarea class="a-textarea" rows="3" formControlName="excerpt" maxlength="400" [class.invalid]="errors()['excerpt']"></textarea>
                @if (errors()['excerpt']) { <span class="a-error">{{ errors()['excerpt'] }}</span> }
              </label>

              <label class="a-field">Article
                <textarea class="a-textarea" rows="16" formControlName="content" placeholder="Write the article here…" [class.invalid]="errors()['content']"></textarea>
                <span class="a-hint">Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading and <code>- </code> for bullet points.</span>
                @if (errors()['content']) { <span class="a-error">{{ errors()['content'] }}</span> }
              </label>
            </div>
          </section>
        </div>

        <aside class="col-side">
          <section class="a-card">
            <div class="a-card-head"><div><h2>Publish</h2><p>Drafts stay hidden from the website.</p></div></div>
            <div class="a-card-body stack">
              <fieldset class="status">
                <legend>Status</legend>
                <label class="choice" [class.on]="form.controls.status.value === 'draft'">
                  <input type="radio" formControlName="status" value="draft" />
                  <span><strong>Draft</strong><small>Hidden from visitors</small></span>
                </label>
                <label class="choice" [class.on]="form.controls.status.value === 'published'">
                  <input type="radio" formControlName="status" value="published" />
                  <span><strong>Published</strong><small>Live on the website</small></span>
                </label>
              </fieldset>

              <label class="a-field">Date
                <input class="a-input" type="date" formControlName="date" />
              </label>

              @if (message()) { <p class="a-error" role="alert">{{ message() }}</p> }

              <div class="buttons">
                <button class="a-btn a-btn-primary" type="submit" [disabled]="busy()">{{ busy() ? 'Saving…' : (originalSlug() ? 'Save changes' : 'Save post') }}</button>
                <a class="a-btn a-btn-secondary" routerLink="/admin/blogs">Cancel</a>
              </div>
            </div>
          </section>

          <section class="a-card">
            <div class="a-card-head"><div><h2>Cover image</h2></div></div>
            <div class="a-card-body stack">
              <img class="preview" [src]="form.controls.image.value" alt="Cover preview" />
              <div class="img-actions">
                <label class="a-btn a-btn-secondary a-btn-sm file-btn" [class.disabled]="uploading()">
                  {{ uploading() ? 'Uploading…' : 'Upload image' }}
                  <input type="file" accept="image/jpeg,image/png,image/webp" (change)="onFile($event)" [disabled]="uploading()" hidden />
                </label>
                <button type="button" class="a-btn a-btn-secondary a-btn-sm" (click)="showLink.set(!showLink())">Paste link</button>
                <button type="button" class="a-btn a-btn-sm link-btn" (click)="useDefaultImage()">Use default</button>
              </div>
              @if (showLink()) {
                <input class="a-input" type="text" formControlName="image" placeholder="https://example.com/photo.jpg" aria-label="Image link" />
              }
              <span class="a-hint">JPG, PNG or WebP. Large photos are resized automatically. A wide image works best.</span>
              @if (uploading()) { <p class="up-status info" role="status">Uploading your image…</p> }
              @if (uploadOk()) { <p class="up-status ok" role="status">Image uploaded. It is now the cover image. Click Save to keep it.</p> }
              @if (imageError()) {
                <p class="up-status err" role="alert">
                  {{ imageError() }}
                  @if (sessionExpired()) { <a routerLink="/admin/login" target="_blank">Sign in again</a> }
                </p>
              }
              @if (errors()['image']) { <span class="a-error">{{ errors()['image'] }}</span> }
            </div>
          </section>
        </aside>
      </form>
    }
  `,
  styles: `
    .back { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 16px; font-size: 13px; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 20px; align-items: start; }
    .col-side { display: grid; gap: 20px; position: sticky; top: 16px; }
    .stack { display: grid; gap: 18px; }

    .slug-input {
      display: flex; align-items: stretch; border: 1px solid var(--a-border); border-radius: var(--a-radius); overflow: hidden; background: #fff; font-weight: 400;
      &:focus-within { border-color: var(--a-primary); box-shadow: 0 0 0 3px var(--a-primary-soft); }
      .prefix { display: flex; align-items: center; padding: 0 12px; background: #fbf4ec; color: var(--a-muted); font-size: 13px; white-space: nowrap; border-right: 1px solid var(--a-border); }
      input { flex: 1; min-width: 0; padding: 10px 12px; border: 0; font: inherit; font-size: 14px; &:focus { outline: 0; } }
    }

    code { padding: 1px 5px; background: #f6e6d5; border-radius: 3px; }

    .status { margin: 0; padding: 0; border: 0; display: grid; gap: 8px; legend { padding: 0; margin-bottom: 8px; font-weight: 600; font-size: 13px; } }
    .choice {
      display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--a-border); border-radius: var(--a-radius); cursor: pointer; font-weight: 400;
      transition: border-color .15s ease, background .15s ease;
      input { accent-color: var(--a-primary); width: 16px; height: 16px; margin: 0; }
      span { display: grid; line-height: 1.3; } strong { font-size: 14px; } small { color: var(--a-muted); font-size: 12px; }
      &.on { border-color: var(--a-primary); background: var(--a-primary-soft); }
    }

    .buttons { display: grid; gap: 10px; .a-btn { width: 100%; } }

    .preview { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: var(--a-radius); border: 1px solid var(--a-border); background: #fbf4ec; }
    .img-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .file-btn { cursor: pointer; &.disabled { opacity: .6; cursor: default; } }
    .up-status { margin: 0; padding: 10px 12px; border-radius: var(--a-radius); font-size: 13px; font-weight: 600; line-height: 1.45; }
    .up-status.info { background: #f6e6d5; color: #6b625c; }
    .up-status.ok { background: var(--a-success-soft); color: #166534; }
    .up-status.err { background: var(--a-danger-soft); color: #b42318; }
    .up-status a { margin-left: 6px; text-decoration: underline; }
    .link-btn { background: none; color: var(--a-primary); padding: 0 6px; &:hover { text-decoration: underline; } }

    @media (max-width: 1100px) {
      .layout { grid-template-columns: 1fr; }
      .col-side { position: static; }
    }
  `,
})
export class AdminBlogEditor {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(AdminService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly notFound = signal(false);
  protected readonly busy = signal(false);
  protected readonly message = signal('');
  protected readonly errors = signal<Record<string, string>>({});
  protected readonly originalSlug = signal<string | null>(null);
  protected readonly slugTouched = signal(false);
  protected readonly uploading = signal(false);
  protected readonly showLink = signal(false);
  protected readonly imageError = signal('');
  protected readonly uploadOk = signal(false);
  protected readonly sessionExpired = signal(false);

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
    // the page URL follows the title until it is edited by hand
    this.form.controls.title.valueChanges.pipe(takeUntilDestroyed()).subscribe(t => {
      if (!this.slugTouched()) this.form.controls.slug.setValue(slugify(t), { emitEvent: false });
    });

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) this.loadExisting(slug);
  }

  private async loadExisting(slug: string) {
    this.loading.set(true);
    const posts = await this.admin.listPosts();
    const post = posts?.find(p => p.slug === slug);
    this.loading.set(false);
    if (!post) return this.notFound.set(true);
    this.originalSlug.set(post.slug);
    this.slugTouched.set(true);
    this.form.reset({ ...post });
  }

  protected useDefaultImage() {
    this.form.controls.image.setValue(DEFAULT_IMAGE);
    this.showLink.set(false);
    this.imageError.set('');
    this.uploadOk.set(false);
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

  /** A plain-English reason for every way an upload can fail, so the admin is never left guessing. */
  private failure(reason: 'type' | 'heic' | 'big' | 'unreadable' | 'session' | 'network' | 'size' | 'server', file: File, status = 0, serverMessage = '') {
    this.sessionExpired.set(reason === 'session');
    const name = `"${file.name}"`;
    const messages = {
      type: `${name} is not a supported image. Please choose a JPG, PNG or WebP photo.`,
      heic: `${name} is an iPhone (HEIC) photo, which browsers can't read. Please choose a JPG or PNG, or export it as JPG first.`,
      big: `${name} is too large (over 25 MB). Please choose a smaller photo.`,
      unreadable: `${name} could not be opened as an image. The file may be damaged. Please try a different JPG, PNG or WebP photo.`,
      session: 'Your session has expired, so the image was not uploaded. Please sign in again, then try once more.',
      network: 'The image could not be sent because the server did not respond. Check your internet connection (or that the server is running) and try again.',
      size: 'The image is still over 4 MB after resizing. Please choose a smaller or simpler photo.',
      server: serverMessage || `The server could not save the image (error ${status || 'unknown'}). Please try again in a moment.`,
    };
    this.imageError.set(messages[reason]);
  }

  protected async onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.imageError.set('');
    this.uploadOk.set(false);
    this.sessionExpired.set(false);

    // some systems report an empty type, so fall back to the file extension
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const type = file.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' } as Record<string, string>)[ext] || '';
    if (/heic|heif/i.test(type) || /^(heic|heif)$/.test(ext)) return this.failure('heic', file);
    if (!/^image\/(jpeg|png|webp)$/.test(type)) return this.failure('type', file);
    if (file.size > 25 * 1024 * 1024) return this.failure('big', file);

    this.uploading.set(true);
    try {
      let blob: Blob;
      try {
        blob = await this.compress(file);
      } catch {
        return this.failure('unreadable', file);
      }

      let res: Response;
      try {
        res = await fetch('/api/admin-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          credentials: 'same-origin',
          body: blob,
        });
      } catch {
        return this.failure('network', file);
      }

      const json = await res.json().catch(() => ({}));
      if (res.status === 401) return this.failure('session', file);
      if (res.status === 413) return this.failure('size', file);
      // the dev proxy answers 500 with an empty body when the backend is not running
      if (!res.ok && !json.message) return this.failure(res.status >= 500 ? 'network' : 'server', file, res.status);
      if (!res.ok || !json.ok) return this.failure('server', file, res.status, json.message);

      this.form.controls.image.setValue(json.url);
      this.showLink.set(false);
      this.uploadOk.set(true);
    } finally {
      this.uploading.set(false);
    }
  }

  protected async save() {
    this.busy.set(true);
    this.errors.set({});
    this.message.set('');
    const r = await this.admin.call({ action: 'save', originalSlug: this.originalSlug(), post: this.form.getRawValue() });
    this.busy.set(false);

    if (r.status === 401) return;
    if (r.errors) {
      this.errors.set(r.errors);
      this.message.set('Please fix the highlighted fields.');
      return;
    }
    if (!r.ok) {
      this.message.set(r.message ?? 'Could not save.');
      return;
    }
    this.admin.notify(r['post'].status === 'published' ? 'Saved. This post is live on the website.' : 'Saved as a draft. It is not visible on the website.');
    this.router.navigate(['/admin/blogs']);
  }
}
