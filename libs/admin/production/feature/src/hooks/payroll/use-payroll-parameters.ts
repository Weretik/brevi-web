import { useGetPayrollParametersQuery } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function usePayrollParameters() {
  const result = useGetPayrollParametersQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити правила зарплати.')
      : null,
    reload: result.refetch,
  };
}
