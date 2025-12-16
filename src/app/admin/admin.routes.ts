import { Routes } from '@angular/router';
import { Reference } from './features/reference';
import { adminAuthGuard } from '@app/core/auth/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canMatch: [adminAuthGuard],
    component: Reference,
  },
  // public login route
  /*
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/auth/admin-login.page').then((m) => m.AdminLoginPage),
  },
  */
];
