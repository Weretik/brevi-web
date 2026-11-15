import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { productPricesTag } from '../../cache/product-prices-tag';
import { referenceErrorMessages } from '../../errors/reference-error-messages';
import {
  mapGarmentPartOperations,
  mapOperationLabourRates,
} from '../../mappers/garment-part-operations/garment-part-operations.mapper';
import {
  parseGarmentPartOperationsResponse,
  parseSewingSettingsResponse,
} from '../../validators/garment-part-operations/garment-part-operations-response';

import type {
  CreateGarmentPartOperationBody,
  UpdateGarmentPartOperationBody,
} from '../../contracts/garment-part-operations/garment-part-operations-response';
import type { GarmentPartOperation, OperationLabourRates } from '@admin/references/model';

export const garmentPartOperationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listGarmentPartOperations: build.query<GarmentPartOperation[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/garment-part-operations', { signal }),
          (value: unknown) => mapGarmentPartOperations(parseGarmentPartOperationsResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      providesTags: (result) => [
        { type: 'GarmentPartOperation', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'GarmentPartOperation' as const, id })) ?? []),
      ],
    }),
    getOperationLabourRates: build.query<OperationLabourRates, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/pricing/sewing/settings', { signal }),
          (value: unknown) => mapOperationLabourRates(parseSewingSettingsResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
    }),
    createGarmentPartOperation: build.mutation<void, CreateGarmentPartOperationBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/reference/garment-part-operations', { body: body, signal }),
          () => undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error) =>
        error
          ? []
          : [
              productPricesTag,
              { type: 'GarmentPartOperation', id: 'LIST' },
              { type: 'GarmentPart', id: 'LIST' },
            ],
    }),
    updateGarmentPartOperation: build.mutation<
      void,
      { id: number; body: UpdateGarmentPartOperationBody }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reference/garment-part-operations/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              productPricesTag,
              { type: 'GarmentPartOperation', id },
              { type: 'GarmentPartOperation', id: 'LIST' },
            ],
    }),
    deleteGarmentPartOperation: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reference/garment-part-operations/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              productPricesTag,
              { type: 'GarmentPartOperation', id },
              { type: 'GarmentPartOperation', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateGarmentPartOperationMutation,
  useDeleteGarmentPartOperationMutation,
  useGetOperationLabourRatesQuery,
  useListGarmentPartOperationsQuery,
  useUpdateGarmentPartOperationMutation,
} = garmentPartOperationsApi;
