import { useListFabricColorsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function useFabricColors() {
  const result = useListFabricColorsQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити кольори.')
      : null,
    reload: result.refetch,
  };
}
