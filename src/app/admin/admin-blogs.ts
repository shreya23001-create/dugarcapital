import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminPost, AdminService, formatDate } from './admin.service';

type Filter = 'all' | 'published' | 'draft';

@Component({
  selector: 'app-admin-blogs',
  imports: [RouterLink],
  template: `
    <div class="a-page-actions">
      <div class="left">
        <div class="a-tabs" role="tablist" aria-label="Filter posts">
          @for (t of tabs; track t.key) {
            <button type="button" role="tab" [class.active]="filter() === t.key" [attr.aria-selected]="filter() === t.key" (click)="filter.set(t.key)">
              {{ t.label }}<span>{{ count(t.key) }}</span>
            </button>
          }
        </div>
        <label class="a-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.300-4.300"/></svg>
          <span class="sr-only">Search posts</span>
          <input class="a-input" type="search" placeholder="Search posts…" (input)="query.set($any($event.target).value)" />
        </label>
      </div>
      <div class="right">
        <a class="a-btn a-btn-secondary" href="/blogs" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>
          View Website
        </a>
        <a class="a-btn a-btn-primary" routerLink="/admin/blogs/new">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          New Post
        </a>
      </div>
    </div>

    <section class="a-card" aria-label="Blog posts">
      @if (posts(); as all) {
        @if (visible().length) {
          <div class="a-table-wrap">
            <table class="a-table">
              <thead>
                <tr><th>Title</th><th>Status</th><th>Date</th><th class="col-end">Actions</th></tr>
              </thead>
              <tbody>
                @for (p of visible(); track p.slug) {
                  <tr>
                    <td>
                      <span class="cell-title">{{ p.title }}</span>
                      <span class="cell-sub">/{{ p.slug }}</span>
                    </td>
                    <td><span class="a-badge" [class.success]="p.status === 'published'" [class.warn]="p.status === 'draft'">{{ p.status === 'published' ? 'Published' : 'Draft' }}</span></td>
                    <td>{{ fmt(p.date) }}</td>
                    <td>
                      <div class="row-actions">
                        @if (p.status === 'published') {
                          <a class="a-icon-btn" [href]="'/' + p.slug" target="_blank" rel="noopener" title="View on website" [attr.aria-label]="'View ' + p.title">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </a>
                        }
                        <a class="a-icon-btn" [routerLink]="['/admin/blogs', p.slug, 'edit']" title="Edit post" [attr.aria-label]="'Edit ' + p.title">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9M16.500 3.500a2.120 2.120 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
                        </a>
                        <button type="button" class="a-icon-btn danger" title="Delete post" [attr.aria-label]="'Delete ' + p.title" (click)="remove(p)">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="a-empty">
            <strong>{{ all.length ? 'No posts match your search' : 'No posts yet' }}</strong>
            {{ all.length ? 'Try a different filter or search term.' : 'Click "New Post" to write your first article.' }}
          </div>
        }
      } @else {
        <div class="loading" aria-busy="true">
          @for (n of [1, 2, 3]; track n) { <div class="a-skeleton"></div> }
        </div>
      }
    </section>
  `,
  styles: `
    .left, .right { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    .loading { display: grid; gap: 22px; padding: 28px 20px; }
    .loading .a-skeleton:nth-child(odd) { width: 70%; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (max-width: 720px) {
      .a-page-actions { align-items: stretch; }
      .left, .right { width: 100%; }
      .right .a-btn { flex: 1; }
      .a-search { width: 100%; input { min-width: 0; } }
    }
  `,
})
export class AdminBlogs {
  private readonly admin = inject(AdminService);

  protected readonly posts = signal<AdminPost[] | null>(null);
  protected readonly filter = signal<Filter>('all');
  protected readonly query = signal('');
  protected readonly fmt = formatDate;

  protected readonly tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
  ];

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return (this.posts() ?? []).filter(
      p => (this.filter() === 'all' || p.status === this.filter()) && (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q))
    );
  });

  constructor() {
    this.load();
  }

  protected count(f: Filter) {
    const all = this.posts() ?? [];
    return f === 'all' ? all.length : all.filter(p => p.status === f).length;
  }

  private async load() {
    this.posts.set((await this.admin.listPosts()) ?? []);
  }

  protected async remove(p: AdminPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const r = await this.admin.call({ action: 'remove', slug: p.slug });
    if (r.status === 401) return;
    await this.load();
    this.admin.notify(r.ok ? 'Post deleted.' : (r.message ?? 'Could not delete the post.'));
  }
}
