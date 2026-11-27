import { canAccess, useAdminSession } from '@admin/core/auth';
import { useSupplierPreview } from '@admin/references/feature';
import { SupplierCardProvider } from '@admin/shared/ui';

import type { ReactNode } from 'react';

/** Every supplier name in the admin opens the same read-only panel with «Відкрити картку» (CARD-001). */
export function SupplierCardSlot({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const preview = useSupplierPreview({
    canOpenCounterparties:
      session.status === 'authenticated' && canAccess(session.user, 'counterparties'),
  });
  return (
    <SupplierCardProvider open={preview.open}>
      {children}
      {preview.element}
    </SupplierCardProvider>
  );
}
