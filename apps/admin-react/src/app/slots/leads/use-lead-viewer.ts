import { canAccess, useAdminSession } from '@admin/core/auth';

import type { LeadStatsViewer, LeadViewer, SiteRequestViewer } from '@admin/leads/model';

/** «Ліди»: edit = take and call; Admin (the director holds it) may give back anybody's lead (LEAD-001 R-04). */
export function useLeadViewer(): LeadViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { userId: null, isAdmin: false, canEdit: false };
  return {
    userId: Number(session.user.id),
    isAdmin: session.user.roles.includes('Admin'),
    canEdit: canAccess(session.user, 'leads', 'edit'),
  };
}

/** «Адміністрування › Ліди»: edit = «Довідники», create = «Синхронізувати зараз». */
export function useLeadStatsViewer(): LeadStatsViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canEdit: false, canSync: false };
  return {
    canEdit: canAccess(session.user, 'lead-stats', 'edit'),
    canSync: canAccess(session.user, 'lead-stats', 'create'),
  };
}

/** «Заявки з сайту»: edit = take and close; Admin (the director holds it) may close anybody's request (LEAD-002 R-05). */
export function useSiteRequestViewer(): SiteRequestViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { userId: null, isAdmin: false, canEdit: false };
  return {
    userId: Number(session.user.id),
    isAdmin: session.user.roles.includes('Admin'),
    canEdit: canAccess(session.user, 'site-requests', 'edit'),
  };
}
