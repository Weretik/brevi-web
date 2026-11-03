import { useState } from 'react';

/** Selected photo ids; cleared when the folder, search or page changes. */
export function useMediaSelection() {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(new Set());
  return {
    selectedIds,
    toggle: (id: number) =>
      setSelectedIds((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
    selectAll: (ids: readonly number[]) => setSelectedIds(new Set(ids)),
    clear: () => setSelectedIds(new Set()),
  };
}
