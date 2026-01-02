import { Route } from '@angular/router';

export const aboutUsRoutes: Route[] = [
  {
    path: 'about-company',
    loadComponent: () => import('./pages/about-company/about-company').then((m) => m.AboutCompany),
  },
];
