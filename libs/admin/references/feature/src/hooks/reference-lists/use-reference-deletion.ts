import { useState } from 'react';

import type { GridRowSelectionModel } from '@mui/x-data-grid';

/**
 * Row selection and confirmed deletion of a «Цех» list. `deleteOne` removes one row and rejects on
 * failure; failed rows stay selected and are named in the result message.
 */
export function useReferenceDeletion(
  deleteOne: (id: number) => Promise<unknown>,
  onResult: (message: string) => void,
) {
  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pendingDeleteIds?.length || deleting) return;
    setDeleting(true);
    const results = await Promise.allSettled(pendingDeleteIds.map((id) => deleteOne(id)));
    const failedIds = pendingDeleteIds.filter((_, index) => results[index]?.status === 'rejected');
    setSelection({ type: 'include', ids: new Set(failedIds) });
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
    clearSelection: () => setSelection({ type: 'include', ids: new Set() }),
    selectedIds: Array.from(selection.ids).map(Number).filter(Number.isInteger),
    pendingDeleteIds,
    deleting,
    requestDelete: (ids: number[]) => ids.length && setPendingDeleteIds(ids),
    cancelDelete: () => !deleting && setPendingDeleteIds(null),
    confirmDelete,
  };
}
