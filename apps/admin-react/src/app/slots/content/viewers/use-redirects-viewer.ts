import { canAccess, useAdminSession } from '@admin/core/auth';

import type { RedirectsViewer } from '@admin/content/model';

/** «Контент → Переадресації»: create = add and transfer, edit = change, delete = «Видалити» (page `content-redirects`). */
export function useRedirectsViewer(): RedirectsViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated')
    return { canCreate: false, canEdit: false, canDelete: false };
  return {
    canCreate: canAccess(session.user, 'content-redirects', 'create'),
    canEdit: canAccess(session.user, 'content-redirects', 'edit'),
    canDelete: canAccess(session.user, 'content-redirects', 'delete'),
  };
}
