import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { productErrorMessages, serializeProductQuery } from './product-api.shared';
import { mapProductDetail } from '../mappers/product-detail.mapper';
import { mapProductPage } from '../mappers/product-page.mapper';

import type { ProductDetail, ProductDraft, ProductPage, ProductQuery } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type CreateBody = operations['createProduct']['requestBody']['content']['application/json'];
type ReplaceBody = operations['replaceProduct']['requestBody']['content']['application/json'];

export const productsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProducts: build.query<ProductPage, ProductQuery>({
      query: (query) => `/api/v1/products?${serializeProductQuery(query)}`,
      transformResponse: mapProductPage,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      providesTags: (result) => [
        { type: 'Product', id: 'LIST' },
        ...(result?.value.map(({ id }) => ({ type: 'Product' as const, id })) ?? []),
      ],
    }),
    getProduct: build.query<ProductDetail, number>({
      query: (id) => `/api/v1/products/${id}`,
      transformResponse: mapProductDetail,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createProduct: build.mutation<ProductDetail, { id: number; draft: ProductDraft }>({
      query: ({ id, draft }) => ({
        url: '/api/v1/products',
        method: 'POST',
        body: { id, ...draft } satisfies CreateBody,
      }),
      transformResponse: mapProductDetail,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
    replaceProduct: build.mutation<ProductDetail, { id: number; draft: ProductDraft }>({
      query: ({ id, draft }) => ({
        url: `/api/v1/products/${id}`,
        method: 'PUT',
        body: draft satisfies ReplaceBody,
      }),
      transformResponse: mapProductDetail,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(productsApi.util.upsertQueryData('getProduct', id, data));
        } catch {
          // The normalized mutation error is handled by the feature caller.
        }
      },
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
    deleteProduct: build.mutation<void, number>({
      query: (id) => ({ url: `/api/v1/products/${id}`, method: 'DELETE' }),
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'Product', id },
              { type: 'Product', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useListProductsQuery,
  useReplaceProductMutation,
} = productsApi;
