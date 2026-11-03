import {
  useGetPublishedSewingPriceQuery,
  useGetSewingCalculationQuery,
} from '@admin/products/data-access';
import { isAdminApiError } from '@admin/shared/api-client';

import { pricingErrorMessage } from '../../model/pricing/pricing-error-message';

/** The published Article price and the calculation behind it (read-only, CAT-012). */
export function useSewingPricing(productId: number, articleId: number) {
  const scope = { productId, articleId };
  const publication = useGetPublishedSewingPriceQuery(scope);
  const calculationId = publication.currentData?.calculationId ?? null;
  const calculation = useGetSewingCalculationQuery(
    { ...scope, calculationId: calculationId ?? '' },
    { skip: !calculationId },
  );
  const noPublication = isAdminApiError(publication.error) && publication.error.status === 404;

  return {
    calculation: calculation.currentData ?? null,
    published: publication.currentData ?? null,
    calculationLoading: Boolean(calculationId) && calculation.isFetching,
    publicationLoading: publication.isFetching,
    calculationError: calculation.error
      ? pricingErrorMessage(calculation.error, 'Не вдалося завантажити складові ціни.')
      : null,
    publicationError:
      publication.error && !noPublication
        ? pricingErrorMessage(publication.error, 'Не вдалося завантажити ціну.')
        : null,
    onRetryCalculation: () => {
      if (calculationId) void calculation.refetch();
    },
    onRetryPublication: () => {
      void publication.refetch();
    },
  };
}
