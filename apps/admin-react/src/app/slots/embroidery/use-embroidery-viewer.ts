import { canAccess, useAdminSession } from '@admin/core/auth';

import type { EmbroideryViewer } from '@admin/embroidery/feature';

/** «Ціна вишивки»: «Ціна вишивки: собівартість і налаштування» also shows the cost and «Налаштування» (ACC-002 R-02). */
export function useEmbroideryViewer(): EmbroideryViewer {
  const session = useAdminSession();
  return {
    canEditSettings:
      session.status === 'authenticated' && canAccess(session.user, 'embroidery-settings', 'edit'),
  };
}
