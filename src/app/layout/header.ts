import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_LINKS } from '../site-data';

const MOBILE_BREAKPOINT = 900;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:resize)': 'onResize()',
    '(document:keydown.escape)': 'close()',
  },
})
export class Header {
  // Contact is rendered separately as the call-to-action button
  protected readonly links = NAV_LINKS.filter(l => l.path !== '/contact');
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);

  constructor() {
    // Prevent the page behind the full-screen mobile menu from scrolling
    effect(() => document.body.classList.toggle('menu-open', this.open()));
  }

  protected toggle() {
    this.open.update(v => !v);
  }

  protected close() {
    this.open.set(false);
  }

  protected onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }

  protected onResize() {
    if (window.innerWidth > MOBILE_BREAKPOINT) this.close();
  }
}
