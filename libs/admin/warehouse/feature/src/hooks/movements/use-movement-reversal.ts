import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useReverseFabricMovementMutation } from '@admin/warehouse/data-access';
import { stockReasonError } from '@admin/warehouse/model';
import { useState } from 'react';

import type { FabricMovementRow } from '@admin/warehouse/model';

/** «Сторно» of a movement: pick it, give a reason, confirm. */
export function useMovementReversal(onDone: (message: string) => void) {
  const [reverse] = useReverseFabricMovementMutation();
  const [pending, setPending] = useState<FabricMovementRow | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (!pending || busy) return;
    const invalid = stockReasonError(reason) ?? null;
    setError(invalid);
    if (invalid) return;
    setBusy(true);
    try {
      await reverse({ movementId: pending.id, reason: reason.trim() }).unwrap();
      setPending(null);
      onDone('Сторновано. Залишок оновлено.');
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося сторнувати рух.'));
    } finally {
      setBusy(false);
    }
  }

  return {
    pending,
    reason,
    error,
    busy,
    request: (row: FabricMovementRow) => {
      setPending(row);
      setReason('');
      setError(null);
    },
    change: (value: string) => {
      setReason(value);
      setError(null);
    },
    cancel: () => setPending(null),
    confirm,
  };
}
