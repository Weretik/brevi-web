import { lazy } from 'react';

const DashboardPage = lazy(() => import('./pages/dashboard-page'));

export const dashboardRoutes = [{ path: '/', element: <DashboardPage /> }] as const;
