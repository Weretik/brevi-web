import { canAccess, useAdminSession } from '@admin/core/auth';

import type { SiteCompanyViewer } from '@admin/content/model';

/** «Контент → Контакти та компанія»: edit = change the company facts of the site (page `content-company`). */
export function useSiteCompanyViewer(): SiteCompanyViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canEdit: false };
  return { canEdit: canAccess(session.user, 'content-company', 'edit') };
}
