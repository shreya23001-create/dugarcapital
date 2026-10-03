import { Component } from '@angular/core';
import { CASE_STUDIES } from '../site-data';

@Component({
  selector: 'app-testimonials',
  template: `
    <section class="page-title" style="--hero: url('images/backgrounds/bg-testimonials-title.jpg')">
      <div class="container"><h1>Testimonials</h1></div>
    </section>

    <section class="section">
      <div class="container grid grid-2">
        @for (c of cases; track c.company) {
          <article class="card case">
            <img [src]="c.logo" [alt]="c.company" class="client-logo" />
            <h3>{{ c.company }}</h3>
            <p class="meta"><strong>Promoter:</strong> {{ c.promoter }}<br /><strong>Deal Type:</strong> {{ c.deal }}</p>
            <p>{{ c.summary }}</p>
            <blockquote>&ldquo;{{ c.quote }}&rdquo;<footer>&mdash; {{ c.promoter }}</footer></blockquote>
          </article>
        }
      </div>
    </section>
  `,
})
export class Testimonials {
  protected readonly cases = CASE_STUDIES;
}
