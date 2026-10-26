import { adminApi } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapPublishedSewingProducts } from '../../mappers/sewing-pricing/published-sewing-products.mapper';
import { sewingCompositionTag } from '../sewing-composition/sewing-composition.cache';

import type { PublishedSewingProduct } from '@admin/products/model';

export const publishedSewingProductsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPublishedSewingProducts: build.query<PublishedSewingProduct[], number[]>({
      query: (ids) =>
        `/api/v1/pricing/sewing/published?${new URLSearchParams(ids.map((id) => ['productIds', String(id)]))}`,
      transformResponse: (value, _meta, ids) => mapPublishedSewingProducts(value, ids),
      transformErrorResponse: sewingPricingError,
      providesTags: (_result, _error, ids) => [
        { type: 'Product', id: 'LIST' },
        ...ids.map((id) => ({ type: 'Product' as const, id })),
        ...ids.map(sewingCompositionTag),
      ],
    }),
  }),
});

export const { useGetPublishedSewingProductsQuery } = publishedSewingProductsApi;
