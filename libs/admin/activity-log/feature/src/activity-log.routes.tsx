import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ActivityLogPage = lazy(() => import('./pages/activity-log-page'));

export const activityLogPath = '/admin/activity-log';

/** Page `activity-log` of «Права доступу»: the app puts these routes inside `RequirePageAccess`. */
export const activityLogRoutes: (RouteObject & { path: string })[] = [
  { path: activityLogPath, element: <ActivityLogPage /> },
];
