import { useListProductCategoriesQuery } from '@admin/products/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

export function useProductCategories() {
  const result = useListProductCategoriesQuery();
  const notFound = isAdminApiError(result.error) && result.error.status === 404;
  return {
    categories: result.data ?? [],
    error:
      result.error && !notFound
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити категорії.')
        : null,
    reload: result.refetch,
  };
}
