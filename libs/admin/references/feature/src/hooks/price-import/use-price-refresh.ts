import { useRefreshPriceSourceMutation } from '@admin/references/data-access';
import { sortPriceImportRows } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type { PriceImportResult, PriceSource } from '@admin/references/model';

/**
 * «Оновити зараз» of a website or Google Sheets supplier: «Перевірити» reads the supplier now and previews,
 * «Застосувати» reads it again and saves the changed prices (CAT-017 R-12).
 */
export function usePriceRefresh(
  source: PriceSource,
  onApplied: (result: PriceImportResult) => void,
) {
  const [preview, setPreview] = useState<PriceImportResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [send, state] = useRefreshPriceSourceMutation();

  async function run(dryRun: boolean) {
    if (state.isLoading) return;
    setMessage(null);
    try {
      const result = await send({ key: source.key, dryRun }).unwrap();
      const sorted = { ...result, rows: sortPriceImportRows(result.rows) };
      setPreview(dryRun ? sorted : null);
      if (!dryRun) onApplied(sorted);
    } catch (failure) {
      const reasons = isAdminApiError(failure) ? Object.values(failure.fieldErrors) : [];
      setMessage(
        reasons.length > 0
          ? reasons.join(' ')
          : adminApiErrorMessage(
              failure,
              'Не вдалося прочитати ціни постачальника. Спробуйте ще раз.',
            ),
      );
    }
  }

  return {
    preview,
    message,
    sending: state.isLoading,
    check: () => run(true),
    apply: () => run(false),
  };
}
