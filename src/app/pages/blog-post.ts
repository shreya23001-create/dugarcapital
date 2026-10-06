import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { BlogService } from '../blog.service';
import { RichTextPipe } from '../rich-text';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, RichTextPipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
})
export class BlogPostPage {
  private readonly service = inject(BlogService);
  private readonly title = inject(Title);
  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get('slug'))));

  protected readonly loaded = computed(() => this.service.posts() !== null);
  protected readonly post = computed(() => this.service.posts()?.find(b => b.slug === this.slug()));
  protected readonly hero = computed(() => (this.post() ? `url("${this.post()!.image}")` : ''));

  constructor() {
    this.service.load(true);
    effect(() => {
      const p = this.post();
      this.title.setTitle(p ? `${p.title} | Dugar Capital Advisors` : 'Page not found | Dugar Capital Advisors');
    });
  }
}
