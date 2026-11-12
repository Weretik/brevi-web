import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  useReverseFabricMovementMutation,
  useVoidFabricMovementMutation,
} from '@admin/warehouse/data-access';
import { stockReasonError } from '@admin/warehouse/model';
import { useState } from 'react';

import { operationMessage } from '../operations/use-stock-operation';

import type { FabricMovementRow } from '@admin/warehouse/model';
import type { MovementCancelMode } from '@admin/warehouse/ui';

/** The ways a movement may be taken back: «Прибрати з обліку» first, it is the default and can be undone. */
export const movementCancelModes = (row: FabricMovementRow): MovementCancelMode[] => [
  ...(row.canEdit && !row.isVoided ? (['void'] as const) : []),
  ...(row.canReverse ? (['reverse'] as const) : []),
];

/**
 * «Відмінити операцію…»: pick the way, give a reason, confirm. The void operation id is kept across failed tries
 * so a lost answer is replayed instead of voiding twice.
 */
export function useMovementCancel(onDone: (message: string) => void) {
  const [voidMovement] = useVoidFabricMovementMutation();
  const [reverse] = useReverseFabricMovementMutation();
  const [pending, setPending] = useState<FabricMovementRow | null>(null);
  const [mode, setMode] = useState<MovementCancelMode>('void');
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
      if (mode === 'void') {
        const result = await voidMovement({
          movementId: pending.id,
          body: { operationId, expectedRevision: pending.revision, reason: reason.trim() },
        }).unwrap();
        onDone(operationMessage(result, 'Операцію прибрано з обліку. Залишок оновлено.'));
      } else {
        await reverse({ movementId: pending.id, reason: reason.trim() }).unwrap();
        onDone('Записано сторно. Залишок оновлено.');
      }
      setPending(null);
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося відмінити операцію.'));
    } finally {
      setBusy(false);
    }
  }

  return {
    pending,
    mode,
    modes: pending ? movementCancelModes(pending) : [],
    reason,
    error,
    busy,
    request: (row: FabricMovementRow) => {
      const modes = movementCancelModes(row);
      if (modes.length === 0) return;
      setPending(row);
      setMode(modes[0] ?? 'void');
      setOperationId(crypto.randomUUID());
      setReason('');
      setError(null);
    },
    setMode: (value: MovementCancelMode) => {
      setMode(value);
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
