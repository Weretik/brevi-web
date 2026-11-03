import { adminApi } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingCalculation } from '../../mappers/sewing-pricing/sewing-calculation.mapper';

import type { SewingPriceCalculation } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Scope = operations['getSewingCalculation']['parameters']['path'];

/** The saved calculation behind a published Sewing price (read-only; publication is automatic, CAT-012). */
export const sewingCalculationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingCalculation: build.query<SewingPriceCalculation, Scope & { calculationId: string }>({
      query: ({ productId, articleId, calculationId }) =>
        `/api/v1/products/${productId}/articles/${articleId}/pricing/calculations/${calculationId}`,
      transformResponse: (value, _meta, scope) => mapSewingCalculation(value, scope),
      transformErrorResponse: sewingPricingError,
    }),
  }),
});

export const { useGetSewingCalculationQuery } = sewingCalculationsApi;
