import { adminApi } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingArticleSummary } from '../../mappers/sewing-pricing/sewing-article-summary.mapper';
import { sewingCompositionTag } from '../sewing-composition/sewing-composition.cache';

import type { SewingArticleSummary } from '@admin/products/model';

/** Live price of every Article of a sewing model for the product card (CAT-007). */
export const sewingArticleSummaryApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingArticleSummary: build.query<SewingArticleSummary, number>({
      query: (productId) => `/api/v1/products/${productId}/articles/pricing-summary`,
      transformResponse: (value, _meta, productId) => mapSewingArticleSummary(value, productId),
      transformErrorResponse: sewingPricingError,
      providesTags: (_result, _error, productId) => [
        { type: 'Product', id: productId },
        sewingCompositionTag(productId),
      ],
    }),
  }),
});

export const { useGetSewingArticleSummaryQuery } = sewingArticleSummaryApi;
