import { lazy } from 'react';

import type { DashboardViewer } from './model/dashboard-view';

const DashboardPage = lazy(() => import('./pages/dashboard-page'));

interface DashboardRouteOptions {
  /** What the signed-in person may see: desks and blocks by «Права доступу». */
  useViewer: () => DashboardViewer;
}

/** The admin home `/`: «Робочий стіл». */
export function createDashboardRoutes({ useViewer }: DashboardRouteOptions) {
  return [{ path: '/', element: <DashboardPage useViewer={useViewer} /> }];
}
