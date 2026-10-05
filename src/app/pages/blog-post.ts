import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { BlogService } from '../blog.service';

type Block = { type: 'heading' | 'paragraph' | 'list'; text: string; items: string[] };

/**
 * Article text is plain text: blank line = new paragraph, "## " = heading, lines starting with "- " = bullet list.
 * Rendered with normal Angular bindings (never innerHTML), so it can't inject markup.
 */
function toBlocks(content: string): Block[] {
  return content
    .split(/\n\s*\n/)
    .map(chunk => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split('\n').map(l => l.trim());
      if (chunk.startsWith('## ')) return { type: 'heading', text: chunk.slice(3).trim(), items: [] };
      if (lines.every(l => l.startsWith('- '))) return { type: 'list', text: '', items: lines.map(l => l.slice(2).trim()) };
      return { type: 'paragraph', text: chunk, items: [] };
    });
}

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
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
  protected readonly blocks = computed(() => toBlocks(this.post()?.content ?? ''));

  constructor() {
    this.service.load(true);
    effect(() => {
      const p = this.post();
      this.title.setTitle(p ? `${p.title} | Dugar Capital Advisors` : 'Page not found | Dugar Capital Advisors');
    });
  }
}
