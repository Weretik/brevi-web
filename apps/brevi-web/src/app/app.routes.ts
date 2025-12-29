import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./routing/storefront.routes').then((m) => m.storefrontRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./routing/admin.routes').then((m) => m.adminRoutes),
  },
];
