import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./page/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
];
