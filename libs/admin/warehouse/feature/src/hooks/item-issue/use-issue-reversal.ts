import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useReverseFabricIssueMutation } from '@admin/warehouse/data-access';
import { stockReasonError } from '@admin/warehouse/model';
import { useState } from 'react';

import type { FabricIssue, ItemFabric } from '@admin/warehouse/model';

/** «Сторно видачі»: the whole package goes back to the stock and the plan is held again. */
export function useIssueReversal(card: ItemFabric | undefined, onDone: (message: string) => void) {
  const [reverse] = useReverseFabricIssueMutation();
  const [pending, setPending] = useState<FabricIssue | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (!pending || !card || busy) return;
    const invalid = stockReasonError(reason) ?? null;
    setError(invalid);
    if (invalid) return;
    setBusy(true);
    try {
      await reverse({
        orderId: card.orderId,
        issueId: pending.id,
        orderVersion: card.orderVersion,
        reason: reason.trim(),
      }).unwrap();
      setPending(null);
      onDone('Видачу сторновано. Тканина повернулась на склад.');
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося сторнувати видачу.'));
    } finally {
      setBusy(false);
    }
  }

  return {
    pending,
    reason,
    error,
    busy,
    request: (issue: FabricIssue) => {
      setPending(issue);
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
