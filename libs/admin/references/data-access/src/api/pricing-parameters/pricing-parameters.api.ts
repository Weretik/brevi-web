import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { productPricesTag } from '../../cache/product-prices-tag';
import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapPricingParameters } from '../../mappers/pricing-parameters/pricing-parameters.mapper';
import { parsePricingParametersResponse } from '../../validators/pricing-parameters/pricing-parameters-response';

import type {
  CreatePricingParameterBody,
  UpdatePricingParameterBody,
} from '../../contracts/pricing-parameters/pricing-parameters-response';
import type { PricingParameter } from '@admin/references/model';

const tag = 'PricingParameter' as const;

export const pricingParametersApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listPricingParameters: build.query<PricingParameter[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/pricing-parameters', { signal }),
          (value: unknown) => mapPricingParameters(parsePricingParametersResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createPricingParameter: build.mutation<number, CreatePricingParameterBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/reference/pricing-parameters', { body: body, signal }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [productPricesTag, { type: tag, id: 'LIST' }],
    }),
    updatePricingParameter: build.mutation<void, { id: number; body: UpdatePricingParameterBody }>({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reference/pricing-parameters/{id}', {
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
    deletePricingParameter: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reference/pricing-parameters/{id}', {
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
  useCreatePricingParameterMutation,
  useDeletePricingParameterMutation,
  useListPricingParametersQuery,
  useUpdatePricingParameterMutation,
} = pricingParametersApi;
