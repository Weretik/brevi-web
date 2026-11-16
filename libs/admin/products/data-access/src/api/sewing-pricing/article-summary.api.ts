import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingArticleSummary } from '../../mappers/sewing-pricing/sewing-article-summary.mapper';
import { sewingCompositionTag } from '../sewing-composition/sewing-composition.cache';

import type { SewingArticleSummary } from '@admin/products/model';

/** Live price of every Article of a sewing model for the product card (CAT-007). */
export const sewingArticleSummaryApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingArticleSummary: build.query<SewingArticleSummary, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{productId}/articles/pricing-summary', {
            params: { path: { productId } },
            signal,
          }),
          (value) => mapSewingArticleSummary(value, productId),
          sewingPricingError,
        ),
      providesTags: (_result, _error, productId) => [
        { type: 'Product', id: productId },
        sewingCompositionTag(productId),
      ],
    }),
  }),
});

export const { useGetSewingArticleSummaryQuery } = sewingArticleSummaryApi;
