import {
  canManageUsers,
  LoginPage,
  loginPath,
  RequireAdminSession,
  RequireRole,
  useAdminSession,
} from '@admin/core/auth';
import { createUsersRoutes } from '@admin/users/feature';
import { createBrowserRouter } from 'react-router-dom';

import { adminRouteDefinitions } from './admin-route-definitions';
import { AdminRouteLayout } from './admin-route-layout';
import { NotFoundPage } from '../pages/not-found-page';

import type { StaffActor } from '@admin/users/model';

function useSignedInStaff(): StaffActor {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? { id: Number(session.user.id), isDirector: session.user.roles.includes('Director') }
    : { id: null, isDirector: false };
}

const usersRoutes = createUsersRoutes({ useStaffActor: useSignedInStaff });

export function createAdminRouter() {
  return createBrowserRouter([
    { path: loginPath, element: <LoginPage /> },
    {
      element: (
        <RequireAdminSession>{(user) => <AdminRouteLayout user={user} />}</RequireAdminSession>
      ),
      children: [
        ...adminRouteDefinitions,
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
}
