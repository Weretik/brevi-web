import { adminApi } from '@admin/shared/api-client';

import { ppePricingError } from './ppe-pricing-errors';
import { mapPpeProducts } from '../../mappers/ppe-pricing/ppe-products.mapper';

import type { PpeProductPricing } from '@admin/products/model';

export const ppeProductPricesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPpeProductPrices: build.query<PpeProductPricing[], number[]>({
      query: (ids) =>
        `/api/v1/pricing/ppe/products?${new URLSearchParams(ids.map((id) => ['productIds', String(id)]))}`,
      transformResponse: (value, _meta, ids) => mapPpeProducts(value, ids),
      transformErrorResponse: ppePricingError,
      providesTags: (_result, _error, ids) => [
        { type: 'Product', id: 'LIST' },
        ...ids.map((id) => ({ type: 'Product' as const, id })),
      ],
    }),
  }),
});
export const { useGetPpeProductPricesQuery } = ppeProductPricesApi;
