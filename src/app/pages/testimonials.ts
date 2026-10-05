import { Component } from '@angular/core';
import { CASE_STUDIES } from '../site-data';

@Component({
  selector: 'app-testimonials',
  template: `
    <section class="page-title" style="--hero: url('images/backgrounds/bg-testimonials-title.jpg')">
      <div class="container"><h1>Testimonials</h1></div>
    </section>

    <section class="section">
      <h2 class="case-heading">Case Study: Successful SME IPOs and Fundraising Initiatives</h2>
      <div class="container grid grid-2">
        @for (c of cases; track c.company) {
          <article class="card case">
            @if (c.logo) { <img [src]="c.logo" [alt]="c.company" class="client-logo" /> }
            <h3>{{ c.company }}</h3>
            <p class="meta"><strong>Promoter:</strong> {{ c.promoter }}<br /><strong>Deal Type:</strong> {{ c.deal }}</p>
            <p><strong>Overview:</strong> {{ c.summary }}</p>
            <p class="fb-label"><strong>Promoter Feedback:</strong></p>
            <blockquote>&ldquo;{{ c.quote }}&rdquo;</blockquote>
          </article>
        }
      </div>
    </section>
  `,
})
export class Testimonials {
  protected readonly cases = CASE_STUDIES;
}
