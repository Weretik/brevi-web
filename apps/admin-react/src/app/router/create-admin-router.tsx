import { accountingRoutes } from '@admin/accounting/feature';
import { aiRoutes } from '@admin/ai/feature';
import {
  canManageUsers,
  LoginPage,
  loginPath,
  refreshSession,
  RequireAdminSession,
  RequireRole,
  useAdminSession,
} from '@admin/core/auth';
import { purchasingRoutes } from '@admin/purchasing/feature';
import { createAccessRoutes, createProfileRoutes, createUsersRoutes } from '@admin/users/feature';
import { createBrowserRouter } from 'react-router-dom';

import {
  adminRouteDefinitions,
  embroideryRoutes,
  productionOrderRoutes,
  productionReportRoutes,
  productionRoutes,
  tasksRoutes,
} from './admin-route-definitions';
import { AdminRouteLayout } from './admin-route-layout';
import { NotFoundPage } from './not-found-page';
import { RequirePageAccess } from './require-page-access';

import type { StaffActor } from '@admin/users/model';

function useSignedInStaff(): StaffActor {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? { id: Number(session.user.id), isDirector: session.user.roles.includes('Director') }
    : { id: null, isDirector: false };
}

const usersRoutes = createUsersRoutes({ useStaffActor: useSignedInStaff });
const profileRoutes = createProfileRoutes({ onProfileChanged: refreshSession });
const accessRoutes = createAccessRoutes({ onAccessChanged: refreshSession });

export function createAdminRouter() {
  return createBrowserRouter([
    { path: loginPath, element: <LoginPage /> },
    {
      element: (
        <RequireAdminSession>{(user) => <AdminRouteLayout user={user} />}</RequireAdminSession>
      ),
      children: [
        ...profileRoutes,
        { element: <RequireRole allow={canManageUsers} />, children: usersRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: tasksRoutes.admin },
        { element: <RequireRole allow={canManageUsers} />, children: aiRoutes },
        { element: <RequireRole allow={canManageUsers} />, children: accessRoutes },
        {
          element: <RequirePageAccess />,
          children: [
            ...adminRouteDefinitions,
            ...tasksRoutes.board,
            ...embroideryRoutes,
            ...productionRoutes,
            ...productionReportRoutes,
            ...productionOrderRoutes,
            ...accountingRoutes,
            ...purchasingRoutes,
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
}
