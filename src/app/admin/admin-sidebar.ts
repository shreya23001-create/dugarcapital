import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" id="admin-sidebar" [class.open]="open()" aria-label="Admin sidebar">
      <a routerLink="/admin/dashboard" class="brand" aria-label="Dugar Capital Admin Portal home" (click)="close.emit()">
        <img class="logo-full" src="images/logo/logo-header.png" alt="Dugar Capital Advisors" />
        <img class="logo-mark" src="images/logo/favicon.png" alt="" />
      </a>
      <div class="brand-sub"><strong>Admin Portal</strong><span>Content Management</span></div>

      <nav aria-label="Admin navigation">
        <ul>
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active" title="Dashboard" (click)="close.emit()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7.500" height="9" rx="1.500"/><rect x="13.500" y="3" width="7.500" height="5" rx="1.500"/><rect x="13.500" y="12" width="7.500" height="9" rx="1.500"/><rect x="3" y="16" width="7.500" height="5" rx="1.500"/></svg>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/contacts" routerLinkActive="active" title="Contact Us" (click)="close.emit()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              <span>Contact Us</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/blogs" routerLinkActive="active" title="Blog Posts" (click)="close.emit()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>
              <span>Blog Posts</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="foot">
        <button type="button" class="logout" title="Logout" (click)="admin.logout()">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: `
    :host { display: contents; }

    /* same warm dark as the website's header/hero, with the footer's accent line on top */
    .sidebar {
      position: fixed; inset: 0 auto 0 0; z-index: 40; width: 264px; display: flex; flex-direction: column;
      padding: 24px 14px 14px; background: var(--a-dark); color: #d6d0cb; border-right: 1px solid rgba(255, 255, 255, .06);
      transition: transform .25s cubic-bezier(.4, 0, .2, 1), width .2s cubic-bezier(.4, 0, .2, 1);
      &::before { content: ''; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--a-primary), rgba(255, 95, 18, 0) 70%); }
    }

    .brand { display: block; padding: 0 8px; }
    .logo-full { display: block; height: 48px; width: auto; }
    /* the small logo file also contains the start of the first letter, so crop it off and re-centre the swirl */
    .logo-mark { display: none; width: 44px; height: 44px; margin: 0 auto; clip-path: inset(0 14% 0 0); transform: translateX(7%); }

    .brand-sub {
      display: flex; flex-direction: column; margin: 16px 8px 0; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, .1);
      strong { font-family: var(--serif); font-size: 16px; color: #fff; letter-spacing: .02em; }
      span { font-size: 12px; color: #9ca3af; }
    }

    nav { flex: 1; padding-top: 18px; }
    nav ul { display: grid; gap: 4px; }

    nav a, .logout {
      position: relative; display: flex; align-items: center; gap: 12px; width: 100%; height: 44px; padding: 0 12px;
      border: 0; border-radius: var(--a-radius); background: transparent; color: #d6d0cb; font-size: 13px; font-weight: 700;
      letter-spacing: .08em; text-transform: uppercase; cursor: pointer; text-align: left;
      transition: background .18s ease, color .18s ease;
      svg { flex: none; }
      &:hover { background: rgba(255, 255, 255, .07); color: #fff; }
      &:focus-visible { outline: 2px solid var(--a-primary); outline-offset: 1px; }
    }

    nav a.active {
      background: rgba(255, 95, 18, .16); color: #fff;
      svg { color: var(--a-primary); }
      &::before { content: ''; position: absolute; left: -14px; top: 9px; bottom: 9px; width: 3px; border-radius: 0 3px 3px 0; background: var(--a-primary); }
    }

    .foot { padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, .1); }
    .logout:hover { background: rgba(220, 38, 38, .18); color: #ffb4b4; }

    /* tablet: icon rail */
    @media (min-width: 721px) and (max-width: 1099px) {
      .sidebar { width: 76px; padding-inline: 12px; }
      .logo-full, .brand-sub, nav a span, .logout span { display: none; }
      .logo-mark { display: block; }
      .brand { padding: 0; }
      nav a, .logout { justify-content: center; padding: 0; }
      nav a.active::before { left: -12px; }
      nav { padding-top: 20px; }
    }

    /* mobile: off-canvas drawer */
    @media (max-width: 720px) {
      .sidebar { width: 280px; transform: translateX(-100%); box-shadow: none; }
      .sidebar.open { transform: none; box-shadow: 0 20px 50px rgba(0, 0, 0, .45); }
      nav a.active::before { left: -14px; }
    }
  `,
})
export class AdminSidebar {
  protected readonly admin = inject(AdminService);
  readonly open = input(false);
  readonly close = output<void>();
}
