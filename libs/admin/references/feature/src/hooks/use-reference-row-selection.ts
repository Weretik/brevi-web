import { useState } from 'react';

import type { GridRowSelectionModel } from '@mui/x-data-grid';

export function useReferenceRowSelection() {
  const [selection, setSelection] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  function retainFailedDeletes(attemptedIds: readonly number[], failedIds: readonly number[]) {
    setSelection((current) => {
      const retainedIds = new Set(
        [...current.ids].filter(
          (id) => !attemptedIds.includes(Number(id)) || failedIds.includes(Number(id)),
        ),
      );
      for (const id of failedIds) retainedIds.add(id);
      return { type: 'include', ids: retainedIds };
    });
  }

  return {
    selection,
    setSelection,
    selectedIds: Array.from(selection.ids).map(Number).filter(Number.isInteger),
    retainFailedDeletes,
  };
}
