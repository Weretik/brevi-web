import { useListGarmentPartOperationsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

export function useGarmentPartOperations() {
  const result = useListGarmentPartOperationsQuery();
  const empty = isAdminApiError(result.error) && result.error.status === 404;
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error:
      result.error && !empty
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити роботи.')
        : null,
    reload: result.refetch,
  };
}
