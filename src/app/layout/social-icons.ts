import { Component } from '@angular/core';
import { COMPANY } from '../site-data';

@Component({
  selector: 'app-social-icons',
  template: `
    <ul class="social" aria-label="Social media">
      <li>
        <a [href]="company.linkedin" target="_blank" rel="noopener noreferrer" aria-label="Dugar Capital Advisors on LinkedIn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
        </a>
      </li>
    </ul>
  `,
  styles: `
    .social { display: flex; gap: 12px; margin: 0; padding: 0; list-style: none; }
    a {
      display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 50%;
      color: #e5e7eb; background: rgba(255, 255, 255, .06); border: 1px solid var(--border);
      transition: background .25s ease, border-color .25s ease, color .25s ease, transform .25s ease;
    }
    a:hover { background: var(--primary-orange); border-color: var(--primary-orange); color: #fff; transform: translateY(-3px); }
    a:focus-visible { outline: 2px solid var(--primary-orange); outline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) { a { transition: none; } }
  `,
})
export class SocialIcons {
  protected readonly company = COMPANY;
}
