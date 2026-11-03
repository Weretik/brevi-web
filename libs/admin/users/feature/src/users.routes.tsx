import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const UsersPage = lazy(() => import('./pages/users-page'));

export const usersPath = '/admin/users';

export interface UsersRouteOptions {
  /** Hook from the app that returns the signed-in user's ID, so the page can protect the admin's own account. */
  useCurrentUserId: () => number | null;
}

export function createUsersRoutes({ useCurrentUserId }: UsersRouteOptions): RouteObject[] {
  function UsersRoute() {
    return <UsersPage currentUserId={useCurrentUserId()} />;
  }

  return [{ path: usersPath, element: <UsersRoute /> }];
}
