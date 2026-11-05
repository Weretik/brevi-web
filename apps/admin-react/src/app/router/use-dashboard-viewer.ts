import { useAdminSession } from '@admin/core/auth';

import type { DashboardViewer } from '@admin/dashboard/feature';

/** The home blocks follow the server: the workshop for orders roles, КП for Admin and Manager. */
export function useDashboardViewer(): DashboardViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { seesWorkshop: false, seesQuotes: false };
  const roles = session.user.roles;
  const quotes = roles.includes('Admin') || roles.includes('Manager');
  return { seesWorkshop: quotes || roles.includes('WorkshopChief'), seesQuotes: quotes };
}
