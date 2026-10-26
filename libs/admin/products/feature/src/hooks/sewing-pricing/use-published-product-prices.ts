import { useGetPublishedSewingProductsQuery } from '@admin/products/data-access';
import { applyPublishedSewingPrice } from '@admin/products/model';

import { pricingErrorMessage } from '../../model/pricing/pricing-error-message';

import type { Product } from '@admin/products/model';

export function usePublishedProductPrices<T extends Product>(products: readonly T[]) {
  const ids = products
    .filter((product) => product.type === 'Sewing')
    .map((product) => product.id)
    .sort((a, b) => a - b);
  const result = useGetPublishedSewingProductsQuery(ids, { skip: ids.length === 0 });
  const state = result.isError
    ? 'error'
    : !result.currentData || result.isFetching
      ? 'loading'
      : 'ready';
  return {
    pricingError:
      result.isError && ids.length
        ? pricingErrorMessage(result.error, 'Не вдалося завантажити опубліковані ціни.')
        : null,
    products: products.map((product) =>
      applyPublishedSewingPrice(product, result.currentData ?? [], state),
    ),
    reloadPrices: () => {
      if (ids.length) void result.refetch();
    },
  };
}
