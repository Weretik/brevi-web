import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapPpeMarkupRules } from '../../mappers/pricing-parameters/pricing-parameters.mapper';
import { parsePpeMarkupRulesResponse } from '../../validators/pricing-parameters/pricing-parameters-response';
import { referenceErrorMessages, productPricesTag } from '../shared/reference-api.shared';

import type {
  CreatePpeMarkupRuleBody,
  UpdatePpeMarkupRuleBody,
} from '../../contracts/pricing-parameters/pricing-parameters-response';
import type { PpeMarkupRule } from '@admin/references/model';

const tag = 'PpeMarkupRule' as const;

export const ppeMarkupRulesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listPpeMarkupRules: build.query<PpeMarkupRule[], void>({
      query: () => '/api/reference/ppe-markup-rules',
      transformResponse: (value: unknown) => mapPpeMarkupRules(parsePpeMarkupRulesResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createPpeMarkupRule: build.mutation<number, CreatePpeMarkupRuleBody>({
      query: (body) => ({ url: '/api/reference/ppe-markup-rules', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) =>
        error ? [] : [productPricesTag, { type: tag, id: 'LIST' }],
    }),
    updatePpeMarkupRule: build.mutation<void, { id: number; body: UpdatePpeMarkupRuleBody }>({
      query: ({ id, body }) => ({
        url: `/api/reference/ppe-markup-rules/${id}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [productPricesTag, { type: tag, id }, { type: tag, id: 'LIST' }],
    }),
    deletePpeMarkupRule: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/ppe-markup-rules/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error ? [] : [productPricesTag, { type: tag, id }, { type: tag, id: 'LIST' }],
    }),
  }),
});

export const {
  useCreatePpeMarkupRuleMutation,
  useDeletePpeMarkupRuleMutation,
  useListPpeMarkupRulesQuery,
  useUpdatePpeMarkupRuleMutation,
} = ppeMarkupRulesApi;
