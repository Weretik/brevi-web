import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useVoidFabricMovementMutation } from '@admin/warehouse/data-access';
import { stockReasonError } from '@admin/warehouse/model';
import { useState } from 'react';

import { operationMessage } from '../operations/use-stock-operation';

import type { FabricMovementRow } from '@admin/warehouse/model';

/**
 * «Скасувати» a movement: pick it, see the effect, give a reason, confirm. The operation id is kept across failed
 * tries so a lost answer is replayed instead of voiding twice.
 */
export function useMovementVoid(onDone: (message: string) => void) {
  const [voidMovement] = useVoidFabricMovementMutation();
  const [pending, setPending] = useState<FabricMovementRow | null>(null);
  const [operationId, setOperationId] = useState('');
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
      const result = await voidMovement({
        movementId: pending.id,
        body: { operationId, expectedRevision: pending.revision, reason: reason.trim() },
      }).unwrap();
      setPending(null);
      onDone(operationMessage(result, 'Рух скасовано. Залишок оновлено.'));
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося скасувати рух.'));
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
      setOperationId(crypto.randomUUID());
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
