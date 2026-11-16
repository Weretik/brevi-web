import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingPublication } from '../../mappers/sewing-pricing/sewing-publication.mapper';

import type { SewingPublication } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Scope = operations['getPublishedSewingPrice']['parameters']['path'];

export const sewingPublicationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPublishedSewingPrice: build.query<SewingPublication, Scope>({
      queryFn: (scope, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{productId}/articles/{articleId}/pricing/published', {
            params: { path: scope },
            signal,
          }),
          (value) => mapSewingPublication(value, scope),
          sewingPricingError,
        ),
      providesTags: (_result, _error, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
});

export const { useGetPublishedSewingPriceQuery } = sewingPublicationsApi;
