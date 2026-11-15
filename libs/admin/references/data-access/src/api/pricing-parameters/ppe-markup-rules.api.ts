import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { productPricesTag } from '../../cache/product-prices-tag';
import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapPpeMarkupRules } from '../../mappers/pricing-parameters/pricing-parameters.mapper';
import { parsePpeMarkupRulesResponse } from '../../validators/pricing-parameters/pricing-parameters-response';

import type {
  CreatePpeMarkupRuleBody,
  UpdatePpeMarkupRuleBody,
} from '../../contracts/pricing-parameters/pricing-parameters-response';
import type { PpeMarkupRule } from '@admin/references/model';

const tag = 'PpeMarkupRule' as const;

export const ppeMarkupRulesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listPpeMarkupRules: build.query<PpeMarkupRule[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/ppe-markup-rules', { signal }),
          (value: unknown) => mapPpeMarkupRules(parsePpeMarkupRulesResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createPpeMarkupRule: build.mutation<number, CreatePpeMarkupRuleBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/reference/ppe-markup-rules', { body: body, signal }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [productPricesTag, { type: tag, id: 'LIST' }],
    }),
    updatePpeMarkupRule: build.mutation<void, { id: number; body: UpdatePpeMarkupRuleBody }>({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reference/ppe-markup-rules/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [productPricesTag, { type: tag, id }, { type: tag, id: 'LIST' }],
    }),
    deletePpeMarkupRule: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reference/ppe-markup-rules/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
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
