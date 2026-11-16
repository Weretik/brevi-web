import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { ppePricingError } from './ppe-pricing-errors';
import { mapPpeRule } from '../../mappers/ppe-pricing/ppe-rule.mapper';

import type { PpeRuleValues, PpeRuleVersion } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Body = operations['createPpeRuleVersion']['requestBody']['content']['application/json'];
export const ppeRuleVersionsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPpePricingRule: build.query<PpeRuleVersion, string>({
      queryFn: (code, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/pricing/ppe/rules', { params: { query: { code } }, signal }),
          (value) => mapPpeRule(value, code),
          ppePricingError,
        ),
      providesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    createPpeRuleVersion: build.mutation<
      PpeRuleVersion,
      { expectedVersionId: string | null; requestId: string; values: PpeRuleValues }
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/v1/pricing/ppe/rules/versions', {
            body: body satisfies Body,
            signal,
          }),
          (value) => mapPpeRule(value, body.values.code),
          ppePricingError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
  }),
});
export const { useGetPpePricingRuleQuery, useCreatePpeRuleVersionMutation } = ppeRuleVersionsApi;
