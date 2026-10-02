import { useGetProductQuery } from '@admin/products/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

import type { ProductDetail } from '@admin/products/model';

export function useProduct(id: number, initial?: ProductDetail) {
  const invalidId = !Number.isInteger(id) || id < 1;
  const result = useGetProductQuery(id, { skip: invalidId || Boolean(initial) });
  const notFound = invalidId || (isAdminApiError(result.error) && result.error.status === 404);
  return {
    product: result.data ?? initial ?? null,
    loading: !initial && (result.isLoading || result.isFetching),
    error:
      result.error && !notFound
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити товар.')
        : null,
    notFound,
    reload: result.refetch,
  };
}
