import {
  useGetPublishedSewingPriceQuery,
  useGetSewingCalculationQuery,
} from '@admin/products/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import { useSewingPricingActions } from './use-sewing-pricing-actions';
import { pricingErrorMessage } from '../../model/pricing/pricing-error-message';

export function useSewingPricing(productId: number, articleId: number, compositionVersion: number) {
  const scope = { productId, articleId };
  const publication = useGetPublishedSewingPriceQuery(scope);
  const [calculationId, setCalculationId] = useState<string | null>(null);
  const selectedId = calculationId ?? publication.currentData?.calculationId ?? null;
  const calculation = useGetSewingCalculationQuery(
    { ...scope, calculationId: selectedId ?? '' },
    { skip: !selectedId },
  );
  const noPublication = isAdminApiError(publication.error) && publication.error.status === 404;
  const value = calculation.currentData ?? null;
  const actions = useSewingPricingActions(
    scope,
    value,
    Boolean(value && value.compositionVersion !== compositionVersion),
    setCalculationId,
  );
  const alreadyPublished = Boolean(
    value &&
    (value.id === publication.currentData?.calculationId ||
      value.id === actions.publishedCalculationId),
  );

  return {
    calculation: value,
    published: publication.currentData ?? null,
    stale: actions.stale,
    alreadyPublished,
    busy: actions.busy,
    calculationLoading: Boolean(selectedId) && calculation.isFetching,
    publicationLoading: publication.isFetching,
    calculationError: calculation.error
      ? pricingErrorMessage(calculation.error, 'Не вдалося завантажити розрахунок.')
      : null,
    publicationError:
      publication.error && !noPublication
        ? pricingErrorMessage(publication.error, 'Не вдалося завантажити опубліковану ціну.')
        : null,
    writeError: actions.writeError
      ? pricingErrorMessage(actions.writeError, 'Не вдалося зберегти ціну. Спробуйте ще раз.')
      : null,
    onCalculate: () => {
      void actions.calculate();
    },
    onPublish: () => {
      void actions.publishCurrent();
    },
    onRetryCalculation: () => {
      if (selectedId) void calculation.refetch();
    },
    onRetryPublication: () => {
      void publication.refetch();
    },
  };
}
