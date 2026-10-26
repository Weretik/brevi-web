import {
  usePublishSewingCalculationMutation,
  useSaveSewingCalculationMutation,
} from '@admin/products/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import type { SewingPriceCalculation } from '@admin/products/model';

export function useSewingPricingActions(
  scope: { productId: number; articleId: number },
  value: SewingPriceCalculation | null,
  compositionStale: boolean,
  onSaved: (id: string) => void,
) {
  const [save, saving] = useSaveSewingCalculationMutation();
  const [publish, publishing] = usePublishSewingCalculationMutation();
  const requestId = useRef<string | null>(null);
  const [writeError, setWriteError] = useState<unknown>(null);
  const [serverStale, setServerStale] = useState(false);
  const stale = serverStale || compositionStale;
  async function calculate() {
    if (saving.isLoading || publishing.isLoading) return;
    requestId.current ??= crypto.randomUUID();
    setWriteError(null);
    try {
      const saved = await save({ ...scope, requestId: requestId.current }).unwrap();
      onSaved(saved.id);
      requestId.current = null;
      setServerStale(false);
    } catch (error) {
      setWriteError(error);
    }
  }

  async function publishCurrent() {
    if (!value?.calculated || stale || saving.isLoading || publishing.isLoading) return;
    setWriteError(null);
    try {
      await publish({ ...scope, calculationId: value.id }).unwrap();
    } catch (error) {
      if (isAdminApiError(error) && error.status === 409) setServerStale(true);
      setWriteError(error);
    }
  }

  return {
    calculate,
    publishCurrent,
    stale,
    writeError,
    busy: saving.isLoading || publishing.isLoading,
    publishedCalculationId: publishing.data?.calculationId,
  };
}
