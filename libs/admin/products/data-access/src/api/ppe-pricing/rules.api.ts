import { adminApi } from '@admin/shared/api-client';

import { ppePricingError } from './ppe-pricing-errors';
import { mapPpeRule } from '../../mappers/ppe-pricing/ppe-rule.mapper';

import type { PpeRuleValues, PpeRuleVersion } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

type Body = operations['createPpeRuleVersion']['requestBody']['content']['application/json'];
export const ppeRuleVersionsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getPpePricingRule: build.query<PpeRuleVersion, string>({
      query: (code) => `/api/v1/pricing/ppe/rules?${new URLSearchParams({ code })}`,
      transformResponse: (value, _meta, code) => mapPpeRule(value, code),
      transformErrorResponse: ppePricingError,
      providesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    createPpeRuleVersion: build.mutation<
      PpeRuleVersion,
      { expectedVersionId: string | null; requestId: string; values: PpeRuleValues }
    >({
      query: (body) => ({
        url: '/api/v1/pricing/ppe/rules/versions',
        method: 'POST',
        body: body satisfies Body,
      }),
      transformResponse: (value, _meta, args) => mapPpeRule(value, args.values.code),
      transformErrorResponse: ppePricingError,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Product', id: 'LIST' }]),
    }),
  }),
});
export const { useGetPpePricingRuleQuery, useCreatePpeRuleVersionMutation } = ppeRuleVersionsApi;
