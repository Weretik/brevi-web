import { useGetModelCompositionsQuery } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/** «Комплектація моделей», read from «Товари» when the tab opens. */
export function useModelCompositions() {
  const result = useGetModelCompositionsQuery(undefined, { refetchOnMountOrArgChange: true });
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити комплектацію моделей.')
      : null,
    reload: result.refetch,
  };
}
