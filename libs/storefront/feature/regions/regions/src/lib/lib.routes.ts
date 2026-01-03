import { Route } from '@angular/router';

export const regionsRoutes: Route[] = [
  {
    path: 'regions',
    loadComponent: () => import('./pages/regions-page/region-page').then((m) => m.RegionPage),
  },
];
