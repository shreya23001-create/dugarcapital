import { Routes } from '@angular/router';
import { adminGuard, loginGuard } from './admin/admin.guards';

export const routes: Routes = [
  { path: '', title: 'Dugar Capital Advisors', loadComponent: () => import('./pages/home').then(m => m.Home) },
  { path: 'about', title: 'About | Dugar Capital Advisors', loadComponent: () => import('./pages/about').then(m => m.About) },
  { path: 'services', title: 'Services | Dugar Capital Advisors', loadComponent: () => import('./pages/services').then(m => m.Services) },
  { path: 'testimonials', title: 'Testimonials | Dugar Capital Advisors', loadComponent: () => import('./pages/testimonials').then(m => m.Testimonials) },
  { path: 'contact', title: 'Contact | Dugar Capital Advisors', loadComponent: () => import('./pages/contact').then(m => m.Contact) },
  { path: 'blogs', title: 'Blogs | Dugar Capital Advisors', loadComponent: () => import('./pages/blogs').then(m => m.Blogs) },
  {
    path: 'admin',
    children: [
      { path: 'login', title: 'Admin Login | Dugar Capital', canActivate: [loginGuard], loadComponent: () => import('./admin/admin-login').then(m => m.AdminLogin) },
      {
        path: '',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin/admin-layout').then(m => m.AdminLayout),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            title: 'Dashboard | Admin',
            data: { title: 'Dashboard', subtitle: 'A quick overview of your website content and enquiries.' },
            loadComponent: () => import('./admin/admin-dashboard').then(m => m.AdminDashboard),
          },
          {
            path: 'contacts',
            title: 'Contact Us | Admin',
            data: { title: 'Contact Us', subtitle: 'Messages sent from the website contact form.' },
            loadComponent: () => import('./admin/admin-contacts').then(m => m.AdminContacts),
          },
          {
            path: 'blogs',
            title: 'Blog Posts | Admin',
            data: { title: 'Blog Posts', subtitle: 'Manage and publish your website content from one place.' },
            loadComponent: () => import('./admin/admin-blogs').then(m => m.AdminBlogs),
          },
          {
            path: 'blogs/new',
            title: 'New Post | Admin',
            data: { title: 'New Post', subtitle: 'Write a new article. Publish it when it is ready.' },
            loadComponent: () => import('./admin/admin-blog-editor').then(m => m.AdminBlogEditor),
          },
          {
            path: 'blogs/:slug/edit',
            title: 'Edit Post | Admin',
            data: { title: 'Edit Post', subtitle: 'Update this article, or change its status.' },
            loadComponent: () => import('./admin/admin-blog-editor').then(m => m.AdminBlogEditor),
          },
        ],
      },
    ],
  },
  { path: ':slug', loadComponent: () => import('./pages/blog-post').then(m => m.BlogPostPage) },
  { path: '**', redirectTo: '' },
];
