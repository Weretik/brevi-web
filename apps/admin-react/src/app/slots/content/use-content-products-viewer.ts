import { canAccess, useAdminSession } from '@admin/core/auth';

import type { ContentProductsViewer } from '@admin/content/model';

/** «Контент → Товари»: create = transfer of old-site texts, edit = switch and texts, delete = «Видалити сторінку» (page `content-products`). */
export function useContentProductsViewer(): ContentProductsViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated')
    return { canCreate: false, canEdit: false, canDelete: false };
  return {
    canCreate: canAccess(session.user, 'content-products', 'create'),
    canEdit: canAccess(session.user, 'content-products', 'edit'),
    canDelete: canAccess(session.user, 'content-products', 'delete'),
  };
}
