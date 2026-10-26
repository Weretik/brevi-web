import { useGetProductQuery } from '@admin/products/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

import { useProductPrices } from '../pricing/use-product-prices';

import type { ProductDetail } from '@admin/products/model';

export function useProduct(id: number, initial?: ProductDetail) {
  const invalidId = !Number.isInteger(id) || id < 1;
  const result = useGetProductQuery(id, { skip: invalidId || Boolean(initial) });
  const notFound = invalidId || (isAdminApiError(result.error) && result.error.status === 404);
  const product = result.data ?? initial ?? null;
  const prices = useProductPrices(product ? [product] : []);
  return {
    pricingError: prices.pricingError,
    reloadPrices: prices.reloadPrices,
    product: prices.products[0] ?? null,
    loading: !initial && (result.isLoading || result.isFetching),
    error:
      result.error && !notFound
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити товар.')
        : null,
    notFound,
    reload: () => {
      void result.refetch();
      prices.reloadPrices();
    },
  };
}
