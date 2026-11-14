import { canAccess, useAdminSession } from '@admin/core/auth';

import type { SitePagesViewer } from '@admin/content/model';

/** «Контент → Сторінки сайту»: edit = change the search texts of a page (page `content-site-pages`). */
export function useSitePagesViewer(): SitePagesViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canEdit: false };
  return { canEdit: canAccess(session.user, 'content-site-pages', 'edit') };
}
