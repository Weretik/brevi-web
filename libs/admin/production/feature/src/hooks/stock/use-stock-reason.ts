import { validateStockReason } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

/** «Сторно» of a movement or an issue: pick it, give a reason, confirm. */
export function useStockReason<Target>(
  run: (target: Target, reason: string) => Promise<unknown>,
  onDone: (message: string) => void,
  fallback: string,
) {
  const [pending, setPending] = useState<Target | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (pending === null || busy) return;
    const invalid = validateStockReason(reason);
    setError(invalid);
    if (invalid) return;
    setBusy(true);
    try {
      await run(pending, reason.trim());
      setPending(null);
      onDone('Сторновано.');
    } catch (failure) {
      setError(adminApiErrorMessage(failure, fallback));
    } finally {
      setBusy(false);
    }
  }

  return {
    pending,
    reason,
    error,
    busy,
    request: (target: Target) => {
      setPending(target);
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
