import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { productErrorMessages, productQueryParams } from './product-api.shared';
import { mapProductDetail } from '../../mappers/product/product-detail.mapper';
import { mapProductPage } from '../../mappers/product/product-page.mapper';
import { toProductWriteBody } from '../../mappers/product/product-write.mapper';

import type { ProductDetail, ProductDraft, ProductPage, ProductQuery } from '@admin/products/model';

export const productsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProducts: build.query<ProductPage, ProductQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products', {
            params: { query: productQueryParams(query) },
            signal,
          }),
          mapProductPage,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
      providesTags: (result) => [
        { type: 'Product', id: 'LIST' },
        ...(result?.value.map(({ id }) => ({ type: 'Product' as const, id })) ?? []),
      ],
    }),
    getProduct: build.query<ProductDetail, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{id}', { params: { path: { id: id } }, signal }),
          mapProductDetail,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createProduct: build.mutation<ProductDetail, { id: number; draft: ProductDraft }>({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.POST('/api/v1/products', {
            body: { id, ...toProductWriteBody(draft) },
            signal,
          }),
          mapProductDetail,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
    replaceProduct: build.mutation<ProductDetail, { id: number; draft: ProductDraft }>({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/v1/products/{id}', {
            params: { path: { id: id } },
            body: toProductWriteBody(draft),
            signal,
          }),
          mapProductDetail,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
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
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/v1/products/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
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
