import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapPricingParameters } from '../../mappers/pricing-parameters/pricing-parameters.mapper';
import { parsePricingParametersResponse } from '../../validators/pricing-parameters/pricing-parameters-response';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type {
  CreatePricingParameterBody,
  UpdatePricingParameterBody,
} from '../../contracts/pricing-parameters/pricing-parameters-response';
import type { PricingParameter } from '@admin/references/model';

const tag = 'PricingParameter' as const;

export const pricingParametersApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listPricingParameters: build.query<PricingParameter[], void>({
      query: () => '/api/reference/pricing-parameters',
      transformResponse: (value: unknown) =>
        mapPricingParameters(parsePricingParametersResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createPricingParameter: build.mutation<number, CreatePricingParameterBody>({
      query: (body) => ({ url: '/api/reference/pricing-parameters', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    updatePricingParameter: build.mutation<void, { id: number; body: UpdatePricingParameterBody }>({
      query: ({ id, body }) => ({
        url: `/api/reference/pricing-parameters/${id}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
    deletePricingParameter: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/pricing-parameters/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreatePricingParameterMutation,
  useDeletePricingParameterMutation,
  useListPricingParametersQuery,
  useUpdatePricingParameterMutation,
} = pricingParametersApi;
