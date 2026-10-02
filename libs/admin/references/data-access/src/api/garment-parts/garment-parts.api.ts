import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapGarmentParts } from '../../mappers/garment-parts/garment-parts.mapper';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type { operations } from '@admin/shared/contracts';

type CreatePartBody = operations['createGarmentPart']['requestBody']['content']['application/json'];
type UpdatePartBody = operations['updateGarmentPart']['requestBody']['content']['application/json'];

export const garmentPartsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listGarmentParts: build.query<ReturnType<typeof mapGarmentParts>, void>({
      query: () => '/api/reference/garment-parts',
      transformResponse: mapGarmentParts,
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'GarmentPart', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'GarmentPart' as const, id })) ?? []),
      ],
    }),
    createGarmentPart: build.mutation<void, CreatePartBody>({
      query: (body) => ({ url: '/api/reference/garment-parts', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'GarmentPart', id: 'LIST' }]),
    }),
    updateGarmentPart: build.mutation<void, { id: number; body: UpdatePartBody }>({
      query: ({ id, body }) => ({ url: `/api/reference/garment-parts/${id}`, method: 'PUT', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'GarmentPart', id },
              { type: 'GarmentPart', id: 'LIST' },
            ],
    }),
    deleteGarmentPart: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/garment-parts/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'GarmentPart', id },
              { type: 'GarmentPart', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateGarmentPartMutation,
  useDeleteGarmentPartMutation,
  useListGarmentPartsQuery,
  useUpdateGarmentPartMutation,
} = garmentPartsApi;
