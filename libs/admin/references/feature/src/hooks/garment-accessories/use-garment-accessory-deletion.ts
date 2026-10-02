import { useDeleteGarmentAccessoryMutation } from '@admin/references/data-access';
import { useState } from 'react';

import type { GridRowSelectionModel } from '@mui/x-data-grid';

export function useGarmentAccessoryDeletion(onResult: (message: string) => void) {
  const [deleteGarmentAccessory] = useDeleteGarmentAccessoryMutation();
  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
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
      pendingDeleteIds.map((id) => deleteGarmentAccessory(id).unwrap()),
    );
    const failedIds = pendingDeleteIds.filter((_, index) => results[index]?.status === 'rejected');
    setSelection((current) => {
      const retainedIds = new Set(
        [...current.ids].filter(
          (id) => !pendingDeleteIds.includes(Number(id)) || failedIds.includes(Number(id)),
        ),
      );
      for (const id of failedIds) retainedIds.add(id);
      return { type: 'include', ids: retainedIds };
    });
    onResult(
      failedIds.length
        ? `Не вдалося видалити ID: ${failedIds.join(', ')}. Решту списку оновлено.`
        : 'Вибрані записи видалено.',
    );
    setPendingDeleteIds(null);
    setDeleting(false);
  }

  return {
    selection,
    setSelection,
    selectedIds: Array.from(selection.ids).map(Number).filter(Number.isInteger),
    pendingDeleteIds,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
