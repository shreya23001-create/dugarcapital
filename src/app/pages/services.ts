import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES, serviceSlug } from '../site-data';

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  template: `
    <section class="page-title hero-xl" style="--hero: url('images/services/service-corporate-structuring.jpg')">
      <div class="container">
        <p class="eyebrow">Offerings</p>
        <h1>Tailored Financial Solutions to Fuel Your Business Growth</h1>
      </div>
    </section>

    <section class="services-list">
      <div class="container-wide">
        @for (s of services; track s.num; let i = $index) {
          <article class="service-row" [id]="slug(s.title)" [class.reverse]="i % 2 === 1">
            <div class="service-text">
              <h2>{{ s.title }}</h2>
              <p>{{ s.detail }}</p>
              <ul class="arrow-list">
                @for (p of s.points; track p) {
                  <li>{{ p }}</li>
                }
              </ul>
            </div>
            <div class="zoom-img">
              <img [src]="s.image" [alt]="s.title" loading="lazy" />
            </div>
          </article>
        }
      </div>
    </section>

    <section class="service-quote">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true"><path d="M4 17h4l2-4V7H4v6h3zm10 0h4l2-4V7h-6v6h3z"/></svg>
      <blockquote>
        The team at Dugar Capital provided exceptional business advisory services that transformed our growth
        strategy. Their insights and recommendations were practical and effective, driving measurable results in
        a short period. They are truly a trusted partner in our success.
      </blockquote>
      <p class="quote-by">-Vikram Desai, Founder of Orbit Retail</p>
    </section>

    <section class="container-wide cta-banner" style="--cta: url('images/hero/hero-fallback-consultation.jpg')">
      <p class="eyebrow">Ready to elevate your business?</p>
      <h2>Schedule a Consultation Today and Discover How Our Expertise Can Drive Your Success!</h2>
      <a routerLink="/contact" class="btn btn-orange btn-sm">Call to Action</a>
    </section>
  `,
})
export class Services {
  protected readonly services = SERVICES;
  protected readonly slug = serviceSlug;
}
