import { useDeleteEmbroideryCalculationMutation } from '@admin/embroidery/data-access';
import { useState } from 'react';

/** «Видалити розрахунок»: ask first, delete, and close the saved calculation when the server agreed. */
export function useEmbroiderySavedDeletion(id: number, onDeleted: () => void) {
  const [confirming, setConfirming] = useState(false);
  const [remove, removing] = useDeleteEmbroideryCalculationMutation();

  const confirm = async () => {
    const result = await remove(id);
    setConfirming(false);
    if (!('error' in result)) onDeleted();
  };

  return {
    confirming,
    ask: () => setConfirming(true),
    cancel: () => setConfirming(false),
    confirm,
    deleting: removing.isLoading,
    error: removing.isError
      ? ((removing.error as { message?: string } | undefined)?.message ??
        'Не вдалося видалити розрахунок.')
      : null,
  };
}
