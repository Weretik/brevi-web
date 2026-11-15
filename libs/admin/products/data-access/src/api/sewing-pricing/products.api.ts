import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapPublishedSewingProducts } from '../../mappers/sewing-pricing/published-sewing-products.mapper';
import { sewingCompositionTag } from '../sewing-composition/sewing-composition.cache';

import type { PublishedSewingProduct } from '@admin/products/model';

export const publishedSewingProductsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPublishedSewingProducts: build.query<PublishedSewingProduct[], number[]>({
      queryFn: (ids, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/pricing/sewing/published', {
            params: { query: { productIds: ids } },
            signal,
          }),
          (value) => mapPublishedSewingProducts(value, ids),
          sewingPricingError,
        ),
      providesTags: (_result, _error, ids) => [
        { type: 'Product', id: 'LIST' },
        ...ids.map((id) => ({ type: 'Product' as const, id })),
        ...ids.map(sewingCompositionTag),
      ],
    }),
  }),
});

export const { useGetPublishedSewingProductsQuery } = publishedSewingProductsApi;
