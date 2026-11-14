import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const BackgroundTasksPage = lazy(() => import('./pages/background-tasks-page'));

export const backgroundTasksPath = '/admin/background-tasks';

/** Page `background-tasks` of «Права доступу»: the app puts these routes inside `RequirePageAccess`. */
export const backgroundTasksRoutes: (RouteObject & { path: string })[] = [
  { path: backgroundTasksPath, element: <BackgroundTasksPage /> },
];
