import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { productErrorMessages } from './product-api.shared';
import { mapProductCategories } from '../mappers/product-categories.mapper';

export const productLookupsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductCategories: build.query<ReturnType<typeof mapProductCategories>, void>({
      query: () => '/api/reference/product-categories/admin',
      transformResponse: mapProductCategories,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      providesTags: [{ type: 'ProductCategory', id: 'LIST' }],
    }),
  }),
});

export const { useListProductCategoriesQuery } = productLookupsApi;
