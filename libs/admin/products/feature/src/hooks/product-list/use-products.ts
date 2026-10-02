import { useListProductsQuery } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

import type { ProductQuery } from '@admin/products/model';

export function useProducts(query: ProductQuery) {
  const result = useListProductsQuery(query);
  return {
    page: result.data ?? null,
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити товари.')
      : null,
    reload: result.refetch,
  };
}
