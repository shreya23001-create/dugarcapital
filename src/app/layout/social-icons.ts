import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-social-icons',
  imports: [RouterLink],
  template: `
    <ul class="social" aria-label="Social media">
      <li>
        <a routerLink="/about" aria-label="Facebook">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8.6v-7.7H10V11h2.6V8.8c0-2.6 1.6-4 3.9-4 1.1 0 2 .1 2.3.1v2.7h-1.6c-1.3 0-1.5.6-1.5 1.5V11h3l-.4 3.3h-2.6V22H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
        </a>
      </li>
      <li>
        <a routerLink="/about" aria-label="Twitter">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.9.1.5 1.6 2 2.8 3.8 2.8A8.3 8.3 0 0 1 2 18.3 11.7 11.7 0 0 0 8.3 20c7.5 0 11.7-6.300 11.7-11.700v-.5c.8-.6 1.500-1.300 2-2z"/></svg>
        </a>
      </li>
      <li>
        <a routerLink="/about" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm3 15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.2-8.8a1.2 1.2 0 1 0 0 2.400 1.200 1.200 0 0 0 0-2.400z"/></svg>
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
export class SocialIcons {}
