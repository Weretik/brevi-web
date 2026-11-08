import { canAccess, useAdminSession } from '@admin/core/auth';

import type { DashboardViewer } from '@admin/dashboard/feature';

/** The home blocks follow «Права доступу»: the workshop for «Виробничі завдання», КП for «Комерційні пропозиції». */
export function useDashboardViewer(): DashboardViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { seesWorkshop: false, seesQuotes: false };
  return {
    seesWorkshop: canAccess(session.user, 'production-orders'),
    seesQuotes: canAccess(session.user, 'quotes'),
  };
}
