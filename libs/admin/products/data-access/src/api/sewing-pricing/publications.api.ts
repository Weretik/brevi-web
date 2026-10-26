import { adminApi } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingPublication } from '../../mappers/sewing-pricing/sewing-publication.mapper';

import type { SewingPublication } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Scope = operations['getPublishedSewingPrice']['parameters']['path'];

export const sewingPublicationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPublishedSewingPrice: build.query<SewingPublication, Scope>({
      query: ({ productId, articleId }) =>
        `/api/v1/products/${productId}/articles/${articleId}/pricing/published`,
      transformResponse: (value, _meta, scope) => mapSewingPublication(value, scope),
      transformErrorResponse: sewingPricingError,
      providesTags: (_result, _error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    publishSewingCalculation: build.mutation<SewingPublication, Scope & { calculationId: string }>({
      query: ({ productId, articleId, calculationId }) => ({
        url: `/api/v1/products/${productId}/articles/${articleId}/pricing/calculations/${calculationId}/publication`,
        method: 'POST',
      }),
      transformResponse: (value, _meta, scope) => mapSewingPublication(value, scope),
      transformErrorResponse: sewingPricingError,
      invalidatesTags: (_result, error, { productId }) =>
        error
          ? []
          : [
              { type: 'Product', id: productId },
              { type: 'Product', id: 'LIST' },
            ],
    }),
  }),
});

export const { useGetPublishedSewingPriceQuery, usePublishSewingCalculationMutation } =
  sewingPublicationsApi;
