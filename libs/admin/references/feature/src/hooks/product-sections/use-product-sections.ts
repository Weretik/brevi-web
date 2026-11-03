import { useListProductSectionsQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function useProductSections() {
  const result = useListProductSectionsQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити розділи.')
      : null,
    reload: result.refetch,
  };
}
