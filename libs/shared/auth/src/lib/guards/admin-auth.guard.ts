import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { SessionStore } from '../state/session.store';

export const adminAuthGuard: CanMatchFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (session.isAuthenticated()) return true;

  return router.parseUrl('/admin/login');
};
