import {
  canManageUsers,
  canManageWorkshop,
  LoginPage,
  loginPath,
  refreshSession,
  RequireAdminSession,
  RequireRole,
  useAdminSession,
} from '@admin/core/auth';
import { createProfileRoutes, createUsersRoutes } from '@admin/users/feature';
import { createBrowserRouter } from 'react-router-dom';

import { adminRouteDefinitions, productionRoutes, tasksRoutes } from './admin-route-definitions';
import { AdminRouteLayout } from './admin-route-layout';
import { NotFoundPage } from '../pages/not-found-page';

import type { SessionUser } from '@admin/core/auth';
import type { StaffActor } from '@admin/users/model';

function useSignedInStaff(): StaffActor {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? { id: Number(session.user.id), isDirector: session.user.roles.includes('Director') }
    : { id: null, isDirector: false };
}

const usersRoutes = createUsersRoutes({ useStaffActor: useSignedInStaff });
const profileRoutes = createProfileRoutes({ onProfileChanged: refreshSession });

/** Manager tasks belong to managers; Director and Admin manage them (TSK-001 R-01, R-02). */
const canWorkOnTasks = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Manager');

export function createAdminRouter() {
  return createBrowserRouter([
    { path: loginPath, element: <LoginPage /> },
    {
      element: (
        <RequireAdminSession>{(user) => <AdminRouteLayout user={user} />}</RequireAdminSession>
      ),
      children: [
        ...adminRouteDefinitions,
        ...profileRoutes,
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: tasksRoutes.admin },
        { element: <RequireRole allow={canWorkOnTasks} />, children: tasksRoutes.board },
        { element: <RequireRole allow={canManageWorkshop} />, children: productionRoutes },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
}
