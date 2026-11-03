import { useRecalculateSewingPricesMutation } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SewingRecalculationReport } from '@admin/products/model';

const failure = 'Не вдалося перерахувати ціни. Спробуйте ще раз.';

/**
 * «Перерахувати всі» / «Перерахувати ціни» (CAT-011): a dry run first, the dialog shows it, and only
 * the confirmation publishes.
 */
export function useSewingRecalculation(onDone: (message: string) => void) {
  const [recalculate, state] = useRecalculateSewingPricesMutation();
  const [preview, setPreview] = useState<{
    productIds: number[] | null;
    report: SewingRecalculationReport;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(productIds: number[] | null) {
    setError(null);
    try {
      const report = await recalculate({ productIds, dryRun: true }).unwrap();
      setPreview({ productIds, report });
    } catch (cause) {
      onDone(adminApiErrorMessage(cause, failure));
    }
  }

  async function confirm() {
    if (!preview) return;
    setError(null);
    try {
      const report = await recalculate({ productIds: preview.productIds, dryRun: false }).unwrap();
      setPreview(null);
      onDone(
        report.applied
          ? `Опубліковано ${report.changes.length} нових цін.`
          : 'Усі ціни вже актуальні.',
      );
    } catch (cause) {
      setError(adminApiErrorMessage(cause, failure));
    }
  }

  return {
    report: preview?.report ?? null,
    scope: preview?.productIds === null ? ('all' as const) : ('model' as const),
    running: state.isLoading,
    error,
    start: (productIds: number[] | null) => void start(productIds),
    confirm: () => void confirm(),
    cancel: () => {
      setPreview(null);
      setError(null);
    },
  };
}
