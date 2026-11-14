import { canAccess, useAdminSession } from '@admin/core/auth';

import type { SiteCategoriesViewer } from '@admin/content/model';

/** «Контент → Розділи»: create = add a category, edit = switch, order and texts, delete = «Видалити розділ» (page `content-categories`). */
export function useSiteCategoriesViewer(): SiteCategoriesViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated')
    return { canCreate: false, canEdit: false, canDelete: false };
  return {
    canCreate: canAccess(session.user, 'content-categories', 'create'),
    canEdit: canAccess(session.user, 'content-categories', 'edit'),
    canDelete: canAccess(session.user, 'content-categories', 'delete'),
  };
}
