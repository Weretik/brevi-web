import { deleteGarmentPartOperation } from '@admin/references/data-access';
import { useState } from 'react';

export interface GarmentPartOperationActionResult {
  message: string;
  severity: 'success' | 'error';
}

export function useGarmentPartOperationDeletion(
  reload: () => void,
  onResult: (result: GarmentPartOperationActionResult) => void,
  retainFailedDeletes: (attemptedIds: readonly number[], failedIds: readonly number[]) => void,
) {
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  function requestDelete(ids: number[]) {
    if (ids.length) setPendingDeleteIds(ids);
  }
  function cancelDelete() {
    if (!deleting) setPendingDeleteIds(null);
  }

  async function confirmDelete() {
    if (!pendingDeleteIds?.length || deleting) return;
    setDeleting(true);
    const results = await Promise.allSettled(
      pendingDeleteIds.map((id) => deleteGarmentPartOperation(id)),
    );
    const failedIds = pendingDeleteIds.filter((_, index) => results[index]?.status === 'rejected');
    retainFailedDeletes(pendingDeleteIds, failedIds);
    onResult(
      failedIds.length
        ? {
            message: `Не вдалося видалити ID: ${failedIds.join(', ')}. Решту списку оновлено.`,
            severity: 'error',
          }
        : { message: 'Вибрані записи видалено.', severity: 'success' },
    );
    setPendingDeleteIds(null);
    setDeleting(false);
    reload();
  }

  return { pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete };
}
