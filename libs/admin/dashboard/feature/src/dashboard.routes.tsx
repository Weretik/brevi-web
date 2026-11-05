import { lazy } from 'react';

import type { DashboardViewer } from './model/dashboard-view';

const DashboardPage = lazy(() => import('./pages/dashboard-page'));

interface DashboardRouteOptions {
  /** What the signed-in person may see: the workshop blocks, the КП block. */
  useViewer: () => DashboardViewer;
}

/** The admin home `/`. */
export function createDashboardRoutes({ useViewer }: DashboardRouteOptions) {
  return [{ path: '/', element: <DashboardPage useViewer={useViewer} /> }];
}
