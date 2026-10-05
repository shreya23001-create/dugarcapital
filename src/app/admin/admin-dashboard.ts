import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminPost, AdminService, Enquiry, formatDate, formatDateTime } from './admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  template: `
    <section class="stats" aria-label="Overview">
      <article class="a-card stat">
        <span class="icon blue" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>
        </span>
        <div><p class="label">Blog posts</p><p class="value">{{ posts() ? posts()!.length : '–' }}</p><p class="detail">{{ posts() ? published() + ' published · ' + drafts() + ' drafts' : '' }}</p></div>
      </article>
      <article class="a-card stat">
        <span class="icon amber" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.500 3.500a2.120 2.120 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
        </span>
        <div><p class="label">Drafts waiting</p><p class="value">{{ posts() ? drafts() : '–' }}</p><p class="detail">{{ posts() ? (drafts() ? 'Not visible on the website' : 'Everything is published') : '' }}</p></div>
      </article>
      <article class="a-card stat">
        <span class="icon teal" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        </span>
        <div><p class="label">Total enquiries</p><p class="value">{{ enquiries() ? enquiries()!.length : '–' }}</p><p class="detail">From the contact form</p></div>
      </article>
      <article class="a-card stat">
        <span class="icon green" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </span>
        <div><p class="label">Last 7 days</p><p class="value">{{ enquiries() ? weekTotal() : '–' }}</p><p class="detail">New enquiries this week</p></div>
      </article>
    </section>

    <div class="grid">
      <section class="a-card">
        <div class="a-card-head"><div><h2>Enquiries, last 7 days</h2><p>New messages received each day</p></div></div>
        <div class="chart" role="img" [attr.aria-label]="'Enquiries in the last 7 days: ' + weekTotal() + ' in total'">
          @for (day of week(); track $index) {
            <div class="bar-col">
              <span class="bar-count">{{ day.count }}</span>
              <div class="bar-track"><div class="bar" [style.height.%]="day.count ? (day.count / maxDay()) * 100 : 3" [class.zero]="!day.count"></div></div>
              <span class="bar-label">{{ day.label }}</span>
            </div>
          }
        </div>
      </section>

      <section class="a-card">
        <div class="a-card-head"><div><h2>Blog status</h2><p>How much of your content is live</p></div></div>
        <div class="a-card-body status-body">
          @if (posts(); as list) {
            <div class="split-bar" role="img" [attr.aria-label]="published() + ' published and ' + drafts() + ' drafts'">
              <div class="seg live" [style.flex]="published()"></div>
              <div class="seg draft" [style.flex]="drafts()"></div>
              @if (!list.length) { <div class="seg empty" style="flex: 1"></div> }
            </div>
            <ul class="legend">
              <li><span class="dot live"></span>Published <strong>{{ published() }}</strong></li>
              <li><span class="dot draft"></span>Drafts <strong>{{ drafts() }}</strong></li>
            </ul>
            @if (latestPublished(); as p) {
              <p class="note">Latest published: <strong>{{ p.title }}</strong> ({{ d(p.date) }})</p>
            }
          } @else {
            <div class="a-skeleton"></div>
          }
        </div>
      </section>
    </div>

    <div class="grid">
      <section class="a-card">
        <div class="a-card-head">
          <div><h2>Recent enquiries</h2><p>Latest messages from the contact form</p></div>
          <a class="a-link" routerLink="/admin/contacts">View all</a>
        </div>
        @if (enquiries(); as list) {
          @if (list.length) {
            <ul class="feed">
              @for (c of list.slice(0, limit); track c.id) {
                <li>
                  <span class="avatar" aria-hidden="true">{{ c.name.charAt(0).toUpperCase() }}</span>
                  <div class="meta">
                    <strong>{{ c.name }}</strong>
                    <span>{{ c.company || c.email }}</span>
                  </div>
                  <time>{{ dt(c.createdAt) }}</time>
                </li>
              }
            </ul>
            @if (list.length > limit) {
              <a class="more" routerLink="/admin/contacts">View more ({{ list.length - limit }} more) <span aria-hidden="true">&rarr;</span></a>
            }
          } @else {
            <div class="a-empty"><strong>No enquiries yet</strong>New messages will show up here.</div>
          }
        } @else {
          <div class="loading"><div class="a-skeleton"></div><div class="a-skeleton"></div></div>
        }
      </section>

      <section class="a-card">
        <div class="a-card-head">
          <div><h2>Latest blog posts</h2><p>Most recently dated articles</p></div>
          <a class="a-link" routerLink="/admin/blogs">Manage</a>
        </div>
        @if (posts(); as list) {
          @if (list.length) {
            <ul class="feed">
              @for (p of list.slice(0, limit); track p.slug) {
                <li>
                  <div class="meta">
                    <strong>{{ p.title }}</strong>
                    <span>{{ d(p.date) }}</span>
                  </div>
                  <span class="a-badge" [class.success]="p.status === 'published'" [class.warn]="p.status === 'draft'">{{ p.status === 'published' ? 'Published' : 'Draft' }}</span>
                </li>
              }
            </ul>
            @if (list.length > limit) {
              <a class="more" routerLink="/admin/blogs">View more ({{ list.length - limit }} more) <span aria-hidden="true">&rarr;</span></a>
            }
          } @else {
            <div class="a-empty"><strong>No posts yet</strong>Write your first article.</div>
          }
        } @else {
          <div class="loading"><div class="a-skeleton"></div><div class="a-skeleton"></div></div>
        }
      </section>
    </div>

    <section class="a-card quick">
      <div>
        <h2>Quick actions</h2>
        <p>Jump straight to the most common tasks.</p>
      </div>
      <div class="buttons">
        <a class="a-btn a-btn-primary" routerLink="/admin/blogs/new">+ New Post</a>
        <a class="a-btn a-btn-secondary" routerLink="/admin/contacts">Read enquiries</a>
        <a class="a-btn a-btn-secondary" href="/" target="_blank" rel="noopener">View Website</a>
      </div>
    </section>
  `,
  styles: `
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; }
    .stat { display: flex; align-items: center; gap: 14px; padding: 18px 20px; }
    .icon { display: grid; place-items: center; flex: none; width: 46px; height: 46px; border-radius: 12px; }
    .icon.blue { background: rgba(27, 21, 18, .07); color: var(--a-dark); }
    .icon.green { background: var(--a-success-soft); color: #15803d; }
    .icon.amber { background: var(--a-primary-soft); color: var(--a-primary-dark); }
    .icon.teal { background: rgba(42, 157, 143, .12); color: var(--a-teal); }
    .label { font-size: 13px; color: var(--a-muted); }
    .detail { margin-top: 2px; font-size: 12px; color: var(--a-muted); }
    .value { font-size: 28px; font-weight: 700; line-height: 1.15; letter-spacing: -.01em; }

    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-bottom: 20px; }
    .feed li { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #eef2f6; &:last-child { border-bottom: 0; } }
    .avatar { display: grid; place-items: center; flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--a-dark); color: #fff; font-weight: 700; }
    .meta { flex: 1; min-width: 0; display: flex; flex-direction: column; strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; } span { font-size: 12.5px; color: var(--a-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
    time { flex: none; font-size: 12px; color: var(--a-muted); }
    .more { display: block; padding: 14px 20px; border-top: 1px solid var(--a-border); text-align: center; color: var(--a-primary); font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; transition: background .15s ease, color .15s ease; }
    .more:hover { background: #fffaf4; color: var(--a-primary-dark); }
    .more:focus-visible { outline: 2px solid var(--a-primary); outline-offset: -2px; }
    .loading { display: grid; gap: 18px; padding: 24px 20px; }

    .chart { display: flex; align-items: flex-end; gap: 14px; height: 210px; padding: 22px 24px 18px; }
    .bar-col { flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .bar-count { font-size: 12px; font-weight: 700; color: var(--a-text); }
    .bar-track { flex: 1; width: 100%; max-width: 44px; display: flex; align-items: flex-end; }
    .bar { width: 100%; min-height: 4px; border-radius: 6px 6px 2px 2px; background: var(--a-primary); transition: height .4s cubic-bezier(.4, 0, .2, 1); }
    .bar.zero { background: #e2e8f0; }
    .bar-label { font-size: 12px; color: var(--a-muted); }

    .status-body { display: grid; gap: 16px; align-content: start; min-height: 210px; }
    .split-bar { display: flex; height: 14px; border-radius: 999px; overflow: hidden; background: #eef2f6; gap: 2px; }
    .seg.live { background: var(--a-success); }
    .seg.draft { background: #b8aca3; }
    .seg.empty { background: #e2e8f0; }
    .legend { display: flex; flex-wrap: wrap; gap: 8px 24px; }
    .legend li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--a-muted); }
    .legend strong { color: var(--a-text); font-size: 15px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.live { background: var(--a-success); }
    .dot.draft { background: #b8aca3; }
    .note { font-size: 13px; color: var(--a-muted); }
    .note strong { color: var(--a-text); }

    .quick { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding: 20px; p { margin-top: 2px; color: var(--a-muted); font-size: 13px; } }
    .buttons { display: flex; flex-wrap: wrap; gap: 10px; }

    @media (max-width: 1100px) { .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    @media (max-width: 520px) { .stats { grid-template-columns: 1fr; } .buttons .a-btn { flex: 1; } }
  `,
})
export class AdminDashboard {
  private readonly admin = inject(AdminService);

  /** how many items the "recent" panels show before offering a "View more" link */
  protected readonly limit = 5;
  protected readonly posts = signal<AdminPost[] | null>(null);
  protected readonly enquiries = signal<Enquiry[] | null>(null);
  protected readonly published = computed(() => (this.posts() ?? []).filter(p => p.status === 'published').length);
  protected readonly drafts = computed(() => (this.posts() ?? []).filter(p => p.status === 'draft').length);
  protected readonly latestPublished = computed(() => (this.posts() ?? []).find(p => p.status === 'published'));

  /** enquiries received on each of the last 7 days (oldest first) */
  protected readonly week = computed(() => {
    const list = this.enquiries() ?? [];
    return Array.from({ length: 7 }, (_, i) => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (6 - i));
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const count = list.filter(c => {
        const when = new Date(c.createdAt);
        return when >= start && when < end;
      }).length;
      return { label: start.toLocaleDateString('en-US', { weekday: 'short' }), count };
    });
  });
  protected readonly weekTotal = computed(() => this.week().reduce((sum, day) => sum + day.count, 0));
  protected readonly maxDay = computed(() => Math.max(1, ...this.week().map(day => day.count)));
  protected readonly d = formatDate;
  protected readonly dt = formatDateTime;

  constructor() {
    this.admin.listPosts().then(p => this.posts.set(p ?? []));
    this.admin.listEnquiries().then(e => this.enquiries.set(e ?? []));
  }
}
