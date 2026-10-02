import { useListFabricsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

export function useFabrics() {
  const result = useListFabricsQuery();
  const empty = isAdminApiError(result.error) && result.error.status === 404;
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error:
      result.error && !empty
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити тканину.')
        : null,
    reload: result.refetch,
  };
}
