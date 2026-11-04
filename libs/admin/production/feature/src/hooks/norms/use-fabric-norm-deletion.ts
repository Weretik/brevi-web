import { useDeleteFabricNormMutation } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { FabricNormRow } from '@admin/production/model';

export function useFabricNormDeletion(onMessage: (message: string) => void) {
  const [pending, setPending] = useState<FabricNormRow | null>(null);
  const [deleteNorm, state] = useDeleteFabricNormMutation();

  function request(row: FabricNormRow) {
    if (row.norm) setPending(row);
    else onMessage(`У ${row.modelCode} немає норми, видаляти нічого.`);
  }

  async function confirm() {
    if (!pending) return;
    try {
      await deleteNorm(pending.modelCode).unwrap();
      onMessage(`Норму ${pending.modelCode} видалено.`);
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося видалити норму.'));
    }
    setPending(null);
  }

  return { pending, busy: state.isLoading, request, cancel: () => setPending(null), confirm };
}
