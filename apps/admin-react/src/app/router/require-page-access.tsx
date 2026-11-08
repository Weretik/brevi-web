import { canAccess, NoAccessPage, useAdminSession } from '@admin/core/auth';
import { Outlet, useLocation } from 'react-router-dom';

import { accessPageOf } from './page-access';

/** Layout route: a page of «Права доступу» opens only when the user's rights let them see it. */
export function RequirePageAccess() {
  const session = useAdminSession();
  const { pathname } = useLocation();
  const page = accessPageOf(pathname);

  if (page && (session.status !== 'authenticated' || !canAccess(session.user, page))) {
    return <NoAccessPage />;
  }

  return <Outlet />;
}
