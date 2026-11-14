import { canAccess, useAdminSession } from '@admin/core/auth';

import type { SeoSettingsViewer } from '@admin/content/model';

/** «Контент → Налаштування SEO сайту»: edit = change the codes and the picture (page `content-seo-settings`). */
export function useSeoSettingsViewer(): SeoSettingsViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canEdit: false };
  return { canEdit: canAccess(session.user, 'content-seo-settings', 'edit') };
}
