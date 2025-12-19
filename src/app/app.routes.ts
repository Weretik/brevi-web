import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@storefront/storefront.routes').then((m) => m.storefrontRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('@admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
