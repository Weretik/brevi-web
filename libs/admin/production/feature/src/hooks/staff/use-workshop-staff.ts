import { useGetWorkshopStaffQuery } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function useWorkshopStaff() {
  const result = useGetWorkshopStaffQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити працівників.')
      : null,
    reload: result.refetch,
  };
}
