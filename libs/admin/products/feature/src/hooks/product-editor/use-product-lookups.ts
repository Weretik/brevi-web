import {
  useListProductCategoriesQuery,
  useListProductMediaQuery,
} from '@admin/products/data-access';
import {
  useListAdditionalReferencesQuery,
  useListFabricsQuery,
  useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery,
  useListSuppliersQuery,
} from '@admin/references/data-access';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

import type { ProductLookups } from '@admin/products/ui';

function visibleError(error: unknown): unknown {
  return isAdminApiError(error) && error.status === 404 ? undefined : error;
}

export function useProductLookups() {
  const categories = useListProductCategoriesQuery();
  const media = useListProductMediaQuery();
  const fabrics = useListFabricsQuery();
  const accessories = useListGarmentAccessoriesQuery();
  const operations = useListGarmentPartOperationsQuery();
  const suppliers = useListSuppliersQuery();
  const references = useListAdditionalReferencesQuery();
  const results = [categories, media, fabrics, accessories, operations, suppliers, references];
  const error = results.map((result) => visibleError(result.error)).find(Boolean);
  const lookups: ProductLookups = {
    categories: categories.data ?? [],
    media: media.data ?? [],
    fabrics: fabrics.data ?? [],
    accessories: accessories.data ?? [],
    operations: operations.data ?? [],
    suppliers: suppliers.data ?? [],
    references: references.data ?? [],
  };

  return {
    lookups,
    error: error ? adminApiErrorMessage(error, 'Не вдалося завантажити довідники.') : null,
    loading: results.some((result) => result.isLoading),
    reload: () => {
      for (const result of results) void result.refetch();
    },
  };
}
