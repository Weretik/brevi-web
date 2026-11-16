import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingCalculation } from '../../mappers/sewing-pricing/sewing-calculation.mapper';

import type { SewingPriceCalculation } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Scope = operations['getSewingCalculation']['parameters']['path'];

/** The saved calculation behind a published Sewing price (read-only; publication is automatic, CAT-012). */
export const sewingCalculationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingCalculation: build.query<SewingPriceCalculation, Scope & { calculationId: string }>({
      queryFn: (scope, { signal }) =>
        apiCall(
          apiClient.GET(
            '/api/v1/products/{productId}/articles/{articleId}/pricing/calculations/{calculationId}',
            { params: { path: scope }, signal },
          ),
          (value) => mapSewingCalculation(value, scope),
          sewingPricingError,
        ),
    }),
  }),
});

export const { useGetSewingCalculationQuery } = sewingCalculationsApi;
