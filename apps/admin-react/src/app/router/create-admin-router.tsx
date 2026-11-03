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

function useSignedInUserId(): number | null {
  const session = useAdminSession();
  return session.status === 'authenticated' ? Number(session.user.id) : null;
}

const usersRoutes = createUsersRoutes({ useCurrentUserId: useSignedInUserId });

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
