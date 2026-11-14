import { canAccess, useAdminSession } from '@admin/core/auth';

import type { DashboardViewer } from '@admin/dashboard/feature';

const nothing: DashboardViewer = { canSee: () => false, userId: null };

/** «Робочий стіл» follows «Права доступу»: the desks of «Робочі столи» and each block's own page. */
export function useDashboardViewer(): DashboardViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return nothing;
  const { user } = session;
  const userId = Number.parseInt(user.id, 10);
  return {
    canSee: (page) => canAccess(user, page),
    userId: Number.isFinite(userId) ? userId : null,
  };
}
