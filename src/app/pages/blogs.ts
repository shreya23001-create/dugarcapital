import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOGS } from '../site-data';

@Component({
  selector: 'app-blogs',
  imports: [RouterLink],
  template: `
    <section class="page-title">
      <div class="container"><h1>Blogs &ndash; Dugar Capital Advisors</h1></div>
    </section>

    <section class="section">
      <div class="container grid grid-3">
        @for (b of blogs; track b.slug) {
          <article class="card blog">
            <img [src]="b.image" [alt]="b.title" />
            <div class="card-body">
              <time>{{ b.date }}</time>
              <h3>{{ b.title }}</h3>
              <p>{{ b.excerpt }}</p>
              <a [routerLink]="'/' + b.slug" class="btn btn-outline">Read More</a>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class Blogs {
  protected readonly blogs = BLOGS;
}
