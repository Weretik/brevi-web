import { canAccess, NoAccessPage, useAdminSession } from '@admin/core/auth';
import { PageRightsProvider } from '@admin/shared/ui';
import { useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { accessPagesOf } from './page-access';

import type { CanDo } from '@admin/shared/ui';

/**
 * Layout route: a page of «Права доступу» opens only when the user's rights let them see it, and its create, edit
 * and delete controls ask the same rights through `usePageRights`.
 */
export function RequirePageAccess() {
  const session = useAdminSession();
  const { pathname } = useLocation();
  const pages = accessPagesOf(pathname);
  const user = session.status === 'authenticated' ? session.user : null;
  const pagesKey = pages.join(',');

  const can = useCallback<CanDo>(
    (action, page) => {
      if (!user) return false;
      const asked = page ? [page] : pagesKey ? pagesKey.split(',') : [];
      // A system page outside «Права доступу» (users, the rights page) is guarded by its role instead.
      if (asked.length === 0) return true;
      return asked.some((key) => canAccess(user, key, action));
    },
    [user, pagesKey],
  );

  if (pages.length > 0 && (!user || !pages.some((page) => canAccess(user, page)))) {
    return <NoAccessPage />;
  }

  return (
    <PageRightsProvider can={can}>
      <Outlet />
    </PageRightsProvider>
  );
}
