import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapGarmentPartOperations } from '../../mappers/garment-part-operations/garment-part-operations.mapper';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type { operations } from '@admin/shared/contracts';

type CreateOperationBody =
  operations['createGarmentPartOperation']['requestBody']['content']['application/json'];
type UpdateOperationBody =
  operations['updateGarmentPartOperation']['requestBody']['content']['application/json'];

export const garmentPartOperationsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listGarmentPartOperations: build.query<ReturnType<typeof mapGarmentPartOperations>, void>({
      query: () => '/api/reference/garment-part-operations',
      transformResponse: mapGarmentPartOperations,
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'GarmentPartOperation', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'GarmentPartOperation' as const, id })) ?? []),
      ],
    }),
    createGarmentPartOperation: build.mutation<void, CreateOperationBody>({
      query: (body) => ({ url: '/api/reference/garment-part-operations', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'GarmentPartOperation', id: 'LIST' }],
    }),
    updateGarmentPartOperation: build.mutation<void, { id: number; body: UpdateOperationBody }>({
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
              { type: 'GarmentPartOperation', id },
              { type: 'GarmentPartOperation', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateGarmentPartOperationMutation,
  useDeleteGarmentPartOperationMutation,
  useListGarmentPartOperationsQuery,
  useUpdateGarmentPartOperationMutation,
} = garmentPartOperationsApi;
