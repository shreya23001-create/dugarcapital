import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BLOGS } from '../site-data';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post(); as p) {
      <section class="page-title">
        <div class="container">
          <h1>{{ p.title }}</h1>
          <time>{{ p.date }}</time>
        </div>
      </section>
      <article class="section">
        <div class="container narrow">
          <img [src]="p.image" [alt]="p.title" class="rounded" />
          <p class="lead">{{ p.excerpt }}</p>
          <!-- TODO: paste full article body here -->
          <p><a routerLink="/blogs" class="btn btn-outline">&larr; Back to Blogs</a></p>
        </div>
      </article>
    } @else {
      <section class="section">
        <div class="container center">
          <h1>Page not found</h1>
          <p><a routerLink="/" class="btn">Go Home</a></p>
        </div>
      </section>
    }
  `,
})
export class BlogPostPage {
  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get('slug'))));
  protected readonly post = computed(() => BLOGS.find(b => b.slug === this.slug()));
}
