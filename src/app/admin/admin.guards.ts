import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './admin.service';

/** Everything under /admin except the login page requires a valid session. */
export const adminGuard: CanActivateFn = async () => {
  const admin = inject(AdminService);
  const router = inject(Router);
  return (await admin.check()) ? true : router.parseUrl('/admin/login');
};

/** Already signed in? Skip the login page. */
export const loginGuard: CanActivateFn = async () => {
  const admin = inject(AdminService);
  const router = inject(Router);
  return (await admin.check()) ? router.parseUrl('/admin/dashboard') : true;
};
