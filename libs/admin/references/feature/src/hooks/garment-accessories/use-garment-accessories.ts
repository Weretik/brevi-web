import { useListGarmentAccessoriesQuery } from '@admin/references/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

export function useGarmentAccessories() {
  const result = useListGarmentAccessoriesQuery();
  const empty = isAdminApiError(result.error) && result.error.status === 404;
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error:
      result.error && !empty
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити фурнітуру.')
        : null,
    reload: result.refetch,
  };
}
