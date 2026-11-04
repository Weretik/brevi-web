import { useAdminSession } from '@admin/core/auth';

import type { EmbroideryViewer } from '@admin/embroidery/feature';

/** «Ціна вишивки»: Director and Admin also see the cost and «Налаштування» (EMB-001 R-02). */
export function useEmbroideryViewer(): EmbroideryViewer {
  const session = useAdminSession();
  return {
    canEditSettings: session.status === 'authenticated' && session.user.roles.includes('Admin'),
  };
}
