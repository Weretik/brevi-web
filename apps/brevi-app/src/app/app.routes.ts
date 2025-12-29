import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./routing/storefront.routes').then((m) => m.storefrontRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./routing/admin.routes').then((m) => m.adminRoutes),
  },
];
