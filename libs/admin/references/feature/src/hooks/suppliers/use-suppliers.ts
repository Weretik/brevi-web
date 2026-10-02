import { useListSuppliersQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function useSuppliers() {
  const result = useListSuppliersQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити постачальників.')
      : null,
    reload: result.refetch,
  };
}
