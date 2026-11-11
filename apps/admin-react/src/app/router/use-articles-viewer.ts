import { canAccess, useAdminSession } from '@admin/core/auth';

import type { ArticlesViewer } from '@admin/content/model';

/** «Контент → Статті»: create = add an article, edit = switch and texts, delete = «Видалити статтю» (page `content-articles`). */
export function useArticlesViewer(): ArticlesViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated')
    return { canCreate: false, canEdit: false, canDelete: false };
  return {
    canCreate: canAccess(session.user, 'content-articles', 'create'),
    canEdit: canAccess(session.user, 'content-articles', 'edit'),
    canDelete: canAccess(session.user, 'content-articles', 'delete'),
  };
}
