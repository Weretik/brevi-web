import { useListProductMediaQuery } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

export function useMediaLibrary() {
  const result = useListProductMediaQuery();
  return {
    items: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити медіатеку.')
      : null,
    reload: result.refetch,
  };
}
