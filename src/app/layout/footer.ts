import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY, NAV_LINKS, SERVICES, serviceSlug } from '../site-data';
import { SocialIcons } from './social-icons';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SocialIcons],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  host: { '(window:scroll)': 'onScroll()' },
})
export class Footer {
  protected readonly company = COMPANY;
  protected readonly links = NAV_LINKS;
  protected readonly services = SERVICES;
  protected readonly slug = serviceSlug;
  protected readonly showTop = signal(false);

  protected onScroll() {
    this.showTop.set(window.scrollY > 500);
  }

  protected toTop(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
