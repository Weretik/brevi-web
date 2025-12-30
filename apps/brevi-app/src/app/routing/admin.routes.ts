import { DashboardPage } from '@admin/feature-dashboard';
import { Routes } from '@angular/router';
import { adminAuthGuard } from '@shared/auth';

export const adminRoutes: Routes = [
  {
    path: '',
    canMatch: [adminAuthGuard],
    component: DashboardPage,
  },
];
