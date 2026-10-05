import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Header } from './layout/header';
import { Footer } from './layout/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  // The hidden admin page has its own layout: no site header/footer
  protected readonly isAdmin = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split(/[?#]/)[0].startsWith('/admin'))
    ),
    { initialValue: typeof location !== 'undefined' && location.pathname.startsWith('/admin') }
  );
}
