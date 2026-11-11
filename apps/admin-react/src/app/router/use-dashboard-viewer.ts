import { canAccess, useAdminSession } from '@admin/core/auth';

import type { DashboardViewer } from '@admin/dashboard/feature';

const nothing: DashboardViewer = { canSee: () => false };

/** «Робочий стіл» follows «Права доступу»: the desks of «Робочі столи» and each block's own page. */
export function useDashboardViewer(): DashboardViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return nothing;
  const { user } = session;
  return { canSee: (page) => canAccess(user, page) };
}
