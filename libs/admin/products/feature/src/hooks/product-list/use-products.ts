import { useListProductsQuery } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

import { useProductPrices } from '../pricing/use-product-prices';

import type { ProductQuery } from '@admin/products/model';

export function useProducts(query: ProductQuery) {
  const result = useListProductsQuery(query);
  const prices = useProductPrices(result.data?.value ?? []);
  return {
    pricingError: prices.pricingError,
    reloadPrices: prices.reloadPrices,
    page: result.data ? { ...result.data, value: prices.products } : null,
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити товари.')
      : null,
    reload: () => {
      void result.refetch();
      prices.reloadPrices();
    },
  };
}
