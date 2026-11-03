import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import {
  mapGarmentPartOperations,
  mapOperationLabourRates,
} from '../../mappers/garment-part-operations/garment-part-operations.mapper';
import {
  parseGarmentPartOperationsResponse,
  parseSewingSettingsResponse,
} from '../../validators/garment-part-operations/garment-part-operations-response';
import { referenceErrorMessages, productPricesTag } from '../shared/reference-api.shared';

import type {
  CreateGarmentPartOperationBody,
  UpdateGarmentPartOperationBody,
} from '../../contracts/garment-part-operations/garment-part-operations-response';
import type { GarmentPartOperation, OperationLabourRates } from '@admin/references/model';

export const garmentPartOperationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listGarmentPartOperations: build.query<GarmentPartOperation[], void>({
      query: () => '/api/reference/garment-part-operations',
      transformResponse: (value: unknown) =>
        mapGarmentPartOperations(parseGarmentPartOperationsResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'GarmentPartOperation', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'GarmentPartOperation' as const, id })) ?? []),
      ],
    }),
    getOperationLabourRates: build.query<OperationLabourRates, void>({
      query: () => '/api/v1/pricing/sewing/settings',
      transformResponse: (value: unknown) =>
        mapOperationLabourRates(parseSewingSettingsResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
    }),
    createGarmentPartOperation: build.mutation<void, CreateGarmentPartOperationBody>({
      query: (body) => ({ url: '/api/reference/garment-part-operations', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
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
      query: ({ id, body }) => ({
        url: `/api/reference/garment-part-operations/${id}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
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
      query: (id) => ({ url: `/api/reference/garment-part-operations/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
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
