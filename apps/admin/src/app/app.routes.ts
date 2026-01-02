import { DashboardPage } from '@admin/feature-dashboard';
import { Route } from '@angular/router';
import { adminAuthGuard } from '@shared/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    canMatch: [adminAuthGuard],
    component: DashboardPage,
  },
];
