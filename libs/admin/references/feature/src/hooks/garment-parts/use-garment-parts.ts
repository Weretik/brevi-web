import { useListGarmentPartsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

export function useGarmentParts() {
  const result = useListGarmentPartsQuery();
  const empty = isAdminApiError(result.error) && result.error.status === 404;
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error:
      result.error && !empty
        ? adminApiErrorMessage(result.error, 'Не вдалося завантажити елементи виробу.')
        : null,
    reload: result.refetch,
  };
}
