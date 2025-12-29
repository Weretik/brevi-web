import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionStore } from '@shared/auth';

export const adminAuthGuard: CanMatchFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (session.isAuthenticated()) return true;

  return router.parseUrl('/admin/login');
};
