import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import {
  mapProductOverviewItem,
  mapProductOverviewPage,
  productOverviewQueryParams,
} from '../../mappers/product-overview/product-overview.mapper';
import {
  parseProductOverviewItem,
  parseProductOverviewPage,
} from '../../validators/product-overview/validate-product-overview';
import { productErrorMessages } from '../base/product-api.shared';

import type { UpdateProductOverviewBody } from '../../contracts/product-overview/product-overview.dto';
import type {
  ProductOverview,
  ProductOverviewListQuery,
  ProductOverviewPage,
} from '@admin/products/model';

const tag = 'Product' as const;

/**
 * The «Товари» list (CAT-013): one request per page, searched, filtered, sorted and paged on the
 * server, with published prices and fabric variants.
 */
export const productOverviewApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductOverview: build.query<ProductOverviewPage, ProductOverviewListQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/overview', {
            params: { query: productOverviewQueryParams(query) },
            signal,
          }),
          (value: unknown) => mapProductOverviewPage(parseProductOverviewPage(value)),
          (error) => toAdminApiError(error, productErrorMessages),
        ),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.items.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    getProductOverviewItem: build.query<ProductOverview, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{id}/overview', { params: { path: { id: id } }, signal }),
          (value: unknown) => mapProductOverviewItem(parseProductOverviewItem(value)),
          (error) => toAdminApiError(error, productErrorMessages),
        ),
      providesTags: (_result, _error, id) => [{ type: tag, id }],
    }),
    updateProductOverview: build.mutation<void, { id: number; body: UpdateProductOverviewBody }>({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/v1/products/{id}/overview', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, productErrorMessages),
        ),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useListProductOverviewQuery,
  useGetProductOverviewItemQuery,
  useUpdateProductOverviewMutation,
} = productOverviewApi;
