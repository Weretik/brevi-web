import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const AccessRightsPage = lazy(() => import('./pages/access-rights-page'));

export const accessPath = '/admin/access';

export interface AccessRouteOptions {
  /** Re-reads the session after a change (for example `refreshSession` from core/auth), so the menu updates. */
  onAccessChanged: () => Promise<void>;
}

/** «Права доступу»; the app guards it with the Admin role. */
export function createAccessRoutes({ onAccessChanged }: AccessRouteOptions): RouteObject[] {
  return [{ path: accessPath, element: <AccessRightsPage onAccessChanged={onAccessChanged} /> }];
}
