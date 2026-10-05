import { Component, computed, inject, signal } from '@angular/core';
import { AdminService, Enquiry, formatDateTime } from './admin.service';

@Component({
  selector: 'app-admin-contacts',
  template: `
    <div class="a-page-actions">
      <label class="a-search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.300-4.300"/></svg>
        <span class="sr-only">Search enquiries</span>
        <input class="a-input" type="search" placeholder="Search enquiries…" (input)="query.set($any($event.target).value)" />
      </label>
      <p class="total">{{ visible().length }} {{ visible().length === 1 ? 'enquiry' : 'enquiries' }}</p>
    </div>

    <section class="a-card" aria-label="Contact enquiries">
      @if (items(); as all) {
        @if (visible().length) {
          <div class="a-table-wrap">
            <table class="a-table">
              <thead>
                <tr><th>Name</th><th>Contact</th><th>Company</th><th>Received</th><th class="col-end">Actions</th></tr>
              </thead>
              <tbody>
                @for (c of visible(); track c.id) {
                  <tr>
                    <td><span class="cell-title">{{ c.name }}</span></td>
                    <td>
                      <a class="a-link" [href]="'mailto:' + c.email">{{ c.email }}</a>
                      <span class="cell-sub">{{ c.mobile }}</span>
                    </td>
                    <td>{{ c.company || '—' }}</td>
                    <td class="nowrap">{{ fmt(c.createdAt) }}</td>
                    <td>
                      <div class="row-actions">
                        <button type="button" class="a-btn a-btn-secondary a-btn-sm" [attr.aria-expanded]="open() === c.id" (click)="toggle(c.id)">
                          {{ open() === c.id ? 'Hide' : 'Read' }}
                        </button>
                        <button type="button" class="a-icon-btn danger" title="Delete enquiry" [attr.aria-label]="'Delete enquiry from ' + c.name" (click)="remove(c)">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  @if (open() === c.id) {
                    <tr class="detail">
                      <td colspan="5">
                        <p class="msg-label">Message</p>
                        <p class="msg">{{ c.message }}</p>
                        <a class="a-btn a-btn-primary a-btn-sm" [href]="'mailto:' + c.email + '?subject=Re: your enquiry to Dugar Capital Advisors'">Reply by email</a>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="a-empty">
            <strong>{{ all.length ? 'No enquiries match your search' : 'No enquiries yet' }}</strong>
            {{ all.length ? 'Try a different search term.' : 'Messages sent from the website contact form will appear here.' }}
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
    .total { color: var(--a-muted); font-size: 13px; font-weight: 600; }
    .nowrap { white-space: nowrap; color: var(--a-muted); }
    .loading { display: grid; gap: 22px; padding: 28px 20px; }
    .detail td { padding: 4px 20px 22px; background: #fffaf4; }
    .msg-label { margin-bottom: 4px; font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--a-muted); }
    .msg { margin-bottom: 14px; white-space: pre-wrap; line-height: 1.7; max-width: 80ch; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (max-width: 720px) { .a-search { width: 100%; input { min-width: 0; } } }
  `,
})
export class AdminContacts {
  private readonly admin = inject(AdminService);

  protected readonly items = signal<Enquiry[] | null>(null);
  protected readonly query = signal('');
  protected readonly open = signal<string | null>(null);
  protected readonly fmt = formatDateTime;

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return (this.items() ?? []).filter(
      c => !q || [c.name, c.email, c.company, c.mobile, c.message].some(v => v.toLowerCase().includes(q))
    );
  });

  constructor() {
    this.load();
  }

  private async load() {
    this.items.set((await this.admin.listEnquiries()) ?? []);
  }

  protected toggle(id: string) {
    this.open.set(this.open() === id ? null : id);
  }

  protected async remove(c: Enquiry) {
    if (!confirm(`Delete the enquiry from ${c.name}? This cannot be undone.`)) return;
    const r = await this.admin.call({ action: 'removeContact', id: c.id });
    if (r.status === 401) return;
    await this.load();
    this.admin.notify(r.ok ? 'Enquiry deleted.' : (r.message ?? 'Could not delete the enquiry.'));
  }
}
