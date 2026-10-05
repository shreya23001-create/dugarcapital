import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blogs',
  imports: [RouterLink],
  templateUrl: './blogs.html',
  styleUrl: './blogs.scss',
})
export class Blogs {
  private readonly service = inject(BlogService);
  protected readonly blogs = this.service.posts;

  constructor() {
    this.service.load(true);
  }
}
