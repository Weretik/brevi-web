import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { ppePricingError } from './ppe-pricing-errors';
import { mapPpeProducts } from '../../mappers/ppe-pricing/ppe-products.mapper';

import type { PpeProductPricing } from '@admin/products/model';

export const ppeProductPricesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPpeProductPrices: build.query<PpeProductPricing[], number[]>({
      queryFn: (ids, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/pricing/ppe/products', {
            params: { query: { productIds: ids } },
            signal,
          }),
          (value) => mapPpeProducts(value, ids),
          ppePricingError,
        ),
      providesTags: (_result, _error, ids) => [
        { type: 'Product', id: 'LIST' },
        ...ids.map((id) => ({ type: 'Product' as const, id })),
      ],
    }),
  }),
});
export const { useGetPpeProductPricesQuery } = ppeProductPricesApi;
