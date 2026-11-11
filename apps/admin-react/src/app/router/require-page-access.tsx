import { canAccess, NoAccessPage, useAdminSession } from '@admin/core/auth';
import { Outlet, useLocation } from 'react-router-dom';

import { accessPagesOf } from './page-access';

/** Layout route: a page of «Права доступу» opens only when the user's rights let them see it. */
export function RequirePageAccess() {
  const session = useAdminSession();
  const { pathname } = useLocation();
  const pages = accessPagesOf(pathname);

  if (pages.length > 0) {
    const user = session.status === 'authenticated' ? session.user : null;
    if (!user || !pages.some((page) => canAccess(user, page))) return <NoAccessPage />;
  }

  return <Outlet />;
}
