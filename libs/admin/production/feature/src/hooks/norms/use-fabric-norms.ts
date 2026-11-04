import { useGetFabricNormsQuery } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function useFabricNorms() {
  const result = useGetFabricNormsQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити норми.')
      : null,
    reload: result.refetch,
  };
}
