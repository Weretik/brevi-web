import { Outlet } from 'react-router-dom';

import { NoAccessPage } from '../pages/no-access-page';
import { useAdminSession } from '../session/use-admin-session';

import type { SessionUser } from '../session/session-user';

interface RequireRoleProps {
  allow: (user: SessionUser) => boolean;
}

/** Layout route: shows "no access" inside the admin layout when the role does not allow the section. */
export function RequireRole({ allow }: RequireRoleProps) {
  const session = useAdminSession();

  if (session.status !== 'authenticated' || !allow(session.user)) {
    return <NoAccessPage />;
  }

  return <Outlet />;
}
