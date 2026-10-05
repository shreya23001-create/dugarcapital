import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Dugar Capital Advisors', loadComponent: () => import('./pages/home').then(m => m.Home) },
  { path: 'about', title: 'About | Dugar Capital Advisors', loadComponent: () => import('./pages/about').then(m => m.About) },
  { path: 'services', title: 'Services | Dugar Capital Advisors', loadComponent: () => import('./pages/services').then(m => m.Services) },
  { path: 'testimonials', title: 'Testimonials | Dugar Capital Advisors', loadComponent: () => import('./pages/testimonials').then(m => m.Testimonials) },
  { path: 'contact', title: 'Contact | Dugar Capital Advisors', loadComponent: () => import('./pages/contact').then(m => m.Contact) },
  { path: 'blogs', title: 'Blogs | Dugar Capital Advisors', loadComponent: () => import('./pages/blogs').then(m => m.Blogs) },
  { path: 'admin', title: 'Admin | Dugar Capital', loadComponent: () => import('./pages/admin').then(m => m.Admin) },
  { path: ':slug', loadComponent: () => import('./pages/blog-post').then(m => m.BlogPostPage) },
  { path: '**', redirectTo: '' },
];
