import { useGetPpeProductPricesQuery } from '@admin/products/data-access';
import { applyPpePrice } from '@admin/products/model';

import { pricingErrorMessage } from '../../model/pricing/pricing-error-message';

import type { Product } from '@admin/products/model';

export function usePpeProductPrices<T extends Product>(products: readonly T[]) {
  const ids = products
    .filter((x) => x.type === 'Ppe')
    .map((x) => x.id)
    .sort((a, b) => a - b);
  const result = useGetPpeProductPricesQuery(ids, { skip: ids.length === 0 });
  const state = result.isError
    ? 'error'
    : !result.currentData || result.isFetching
      ? 'loading'
      : 'ready';
  return {
    products: products.map((x) => applyPpePrice(x, result.currentData ?? [], state)),
    pricingError:
      result.isError && ids.length
        ? pricingErrorMessage(result.error, 'Не вдалося завантажити ціни ЗІЗ.')
        : null,
    reloadPrices: () => {
      if (ids.length) void result.refetch();
    },
  };
}
