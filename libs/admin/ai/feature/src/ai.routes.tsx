import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const AiSettingsPage = lazy(() => import('./pages/ai-settings-page'));

export const aiSettingsPath = '/admin/ai';

/** Admin only: the app wraps these routes in its role check. */
export const aiRoutes: RouteObject[] = [{ path: aiSettingsPath, element: <AiSettingsPage /> }];
