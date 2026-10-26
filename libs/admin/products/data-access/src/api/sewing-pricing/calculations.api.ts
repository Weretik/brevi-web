import { adminApi } from '@admin/shared/api-client';

import { sewingPricingError } from './pricing-errors';
import { mapSewingCalculation } from '../../mappers/sewing-pricing/sewing-calculation.mapper';

import type { SewingPriceCalculation } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Scope = operations['saveSewingCalculation']['parameters']['path'];
type SaveBody = operations['saveSewingCalculation']['requestBody']['content']['application/json'];

export const sewingCalculationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingCalculation: build.query<SewingPriceCalculation, Scope & { calculationId: string }>({
      query: ({ productId, articleId, calculationId }) =>
        `/api/v1/products/${productId}/articles/${articleId}/pricing/calculations/${calculationId}`,
      transformResponse: (value, _meta, scope) => mapSewingCalculation(value, scope),
      transformErrorResponse: sewingPricingError,
    }),
    saveSewingCalculation: build.mutation<SewingPriceCalculation, Scope & { requestId: string }>({
      query: ({ productId, articleId, requestId }) => ({
        url: `/api/v1/products/${productId}/articles/${articleId}/pricing/calculations`,
        method: 'POST',
        body: { requestId } satisfies SaveBody,
      }),
      transformResponse: (value, _meta, scope) => mapSewingCalculation(value, scope),
      transformErrorResponse: sewingPricingError,
      async onQueryStarted(scope, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await dispatch(
            sewingCalculationsApi.util.upsertQueryData(
              'getSewingCalculation',
              { productId: scope.productId, articleId: scope.articleId, calculationId: data.id },
              data,
            ),
          );
        } catch {
          /* The feature displays the normalized error and retains the retry identity. */
        }
      },
    }),
  }),
});

export const { useGetSewingCalculationQuery, useSaveSewingCalculationMutation } =
  sewingCalculationsApi;
