import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';
import { AdminService } from './admin.service';

/** Shared shell for every signed-in admin page: sidebar + header + page content. */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebar, AdminHeader],
  template: `
    <div class="admin-ui shell">
      <app-admin-sidebar [open]="navOpen()" (close)="navOpen.set(false)" />
      @if (navOpen()) { <button type="button" class="backdrop" aria-label="Close navigation menu" (click)="navOpen.set(false)"></button> }

      <div class="main">
        <app-admin-header [title]="page().title ?? ''" [subtitle]="page().subtitle ?? ''" (menu)="navOpen.set(true)" />

        <main class="content">
          @if (admin.flash(); as msg) {
            <div class="toast" role="status">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              <span>{{ msg }}</span>
              <button type="button" aria-label="Dismiss message" (click)="admin.dismissFlash()">&times;</button>
            </div>
          }
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `
    .shell { min-height: 100vh; background: var(--a-bg); }
    .main { margin-left: 264px; min-width: 0; }
    .content { padding: 0 32px 56px; }

    .backdrop { position: fixed; inset: 0; z-index: 35; border: 0; background: rgba(15, 23, 42, .45); }

    .toast {
      display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding: 12px 14px; border-radius: var(--a-radius);
      border: 1px solid #bfe6cd; background: var(--a-success-soft); color: #166534; font-weight: 600;
      span { flex: 1; }
      button { border: 0; background: none; color: inherit; font-size: 20px; line-height: 1; cursor: pointer; }
    }

    @media (min-width: 721px) and (max-width: 1099px) {
      .main { margin-left: 76px; }
      .content { padding-inline: 24px; }
    }
    @media (max-width: 720px) {
      .main { margin-left: 0; }
      .content { padding: 0 16px 40px; }
    }
  `,
})
export class AdminLayout {
  protected readonly admin = inject(AdminService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly navOpen = signal(false);

  // page title/subtitle come from each child route's `data`
  protected readonly page = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let r = this.route;
        while (r.firstChild) r = r.firstChild;
        // the snapshot doesn't exist yet while the layout itself is still being created
        return (r.snapshot?.data ?? {}) as { title?: string; subtitle?: string };
      })
    ),
    { initialValue: {} as { title?: string; subtitle?: string } }
  );
}
