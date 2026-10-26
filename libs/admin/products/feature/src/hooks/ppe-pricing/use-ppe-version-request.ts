import { isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import { pricingErrorMessage } from '../../model/pricing/pricing-error-message';

export function usePpeVersionRequest(productId: number, canManage: boolean, busy: boolean) {
  const retry = useRef<{ offer?: { key: string; id: string }; rule?: { key: string; id: string } }>(
    {},
  );
  const [error, setError] = useState<unknown>(null);
  const [conflict, setConflict] = useState(false);
  const inFlight = useRef(false);
  async function submit<T>(
    kind: 'offer' | 'rule',
    expectedVersionId: string | null,
    values: T,
    execute: (requestId: string) => Promise<unknown>,
  ) {
    if (!canManage || busy || inFlight.current || conflict) return;
    const key = JSON.stringify({ productId, expectedVersionId, values });
    if (retry.current[kind]?.key !== key) retry.current[kind] = { key, id: crypto.randomUUID() };
    const requestId = retry.current[kind]!.id;
    setError(null);
    inFlight.current = true;
    try {
      await execute(requestId);
      delete retry.current[kind];
    } catch (error) {
      setError(error);
      if (isAdminApiError(error) && error.status === 409) setConflict(true);
    } finally {
      inFlight.current = false;
    }
  }
  return {
    busy,
    conflict,
    error: error
      ? pricingErrorMessage(error, 'Не вдалося зберегти ціни ЗІЗ. Спробуйте ще раз.')
      : null,
    submit,
  };
}
