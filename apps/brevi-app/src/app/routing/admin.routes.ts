import { Routes } from '@angular/router';
import { adminAuthGuard } from '@shared/auth';
import { DashboardPage } from '@admin/feature-dashboard';

export const adminRoutes: Routes = [
  {
    path: '',
    canMatch: [adminAuthGuard],
    component: DashboardPage,
  },
];
