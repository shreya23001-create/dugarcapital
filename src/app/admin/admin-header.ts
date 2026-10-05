import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  template: `
    <header class="top">
      <button type="button" class="menu" aria-label="Open navigation menu" aria-controls="admin-sidebar" (click)="menu.emit()">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>

      <div class="titles">
        <p class="crumb">Admin Portal <span aria-hidden="true">/</span> {{ title() }}</p>
        <h1>{{ title() }}</h1>
        @if (subtitle()) { <p class="sub">{{ subtitle() }}</p> }
      </div>

      <div class="user" aria-label="Signed in as Admin">
        <span class="avatar" aria-hidden="true">A</span>
        <span class="who"><strong>Admin</strong><small>Administrator</small></span>
      </div>
    </header>
  `,
  styles: `
    .top {
      display: flex; align-items: center; gap: 16px; padding: 22px 32px 18px;
    }
    .titles { flex: 1; min-width: 0; }
    .crumb { font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: var(--a-teal); font-weight: 700; span { margin: 0 4px; color: #cdb9a5; } }
    h1 { margin-top: 2px; font-size: 30px; line-height: 1.2; }
    .sub { margin-top: 2px; color: var(--a-muted); font-size: 14px; }

    .menu {
      display: none; width: 40px; height: 40px; align-items: center; justify-content: center; flex: none;
      border: 1px solid var(--a-border); border-radius: var(--a-radius); background: #fff; color: var(--a-text); cursor: pointer;
      &:hover { background: #fffaf4; }
      &:focus-visible { outline: 2px solid var(--a-primary); outline-offset: 2px; }
    }

    .user { display: flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px; border: 1px solid var(--a-border); border-radius: 999px; background: #fff; box-shadow: var(--a-shadow); }
    .avatar { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--a-dark); color: #fff; font-size: 14px; font-weight: 700; }
    .who { display: flex; flex-direction: column; line-height: 1.2; strong { font-size: 13px; } small { font-size: 11px; color: var(--a-muted); } }

    @media (max-width: 720px) {
      .top { padding: 16px 16px 12px; gap: 12px; }
      .menu { display: inline-flex; }
      h1 { font-size: 24px; }
      .crumb { display: none; }
      .who { display: none; }
      .user { padding: 4px; }
    }
  `,
})
export class AdminHeader {
  readonly title = input('');
  readonly subtitle = input('');
  readonly menu = output<void>();
}
