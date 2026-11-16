import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { productErrorMessages } from './product-api.shared';
import { mapProductCategories } from '../../mappers/product/product-categories.mapper';

export const productLookupsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductCategories: build.query<ReturnType<typeof mapProductCategories>, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/product-categories/admin', { signal }),
          mapProductCategories,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
      providesTags: [{ type: 'ProductCategory', id: 'LIST' }],
    }),
  }),
});

export const { useListProductCategoriesQuery } = productLookupsApi;
