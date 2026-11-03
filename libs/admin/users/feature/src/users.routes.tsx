import { lazy } from 'react';

import type { StaffActor } from '@admin/users/model';
import type { RouteObject } from 'react-router-dom';

const UsersPage = lazy(() => import('./pages/users-page'));

export const usersPath = '/admin/users';

export interface UsersRouteOptions {
  /** Hook from the app that returns the signed-in staff member, so the page offers only allowed actions. */
  useStaffActor: () => StaffActor;
}

export function createUsersRoutes({ useStaffActor }: UsersRouteOptions): RouteObject[] {
  function UsersRoute() {
    return <UsersPage actor={useStaffActor()} />;
  }

  return [{ path: usersPath, element: <UsersRoute /> }];
}
