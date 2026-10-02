import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapGarmentAccessories } from '../../mappers/garment-accessories/garment-accessories.mapper';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type { operations } from '@admin/shared/contracts';

type CreateAccessoryBody =
  operations['createGarmentAccessory']['requestBody']['content']['application/json'];
type UpdateAccessoryBody =
  operations['updateGarmentAccessory']['requestBody']['content']['application/json'];

export const garmentAccessoriesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listGarmentAccessories: build.query<ReturnType<typeof mapGarmentAccessories>, void>({
      query: () => '/api/reference/garment-accessories',
      transformResponse: mapGarmentAccessories,
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'GarmentAccessory', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'GarmentAccessory' as const, id })) ?? []),
      ],
    }),
    createGarmentAccessory: build.mutation<void, CreateAccessoryBody>({
      query: (body) => ({ url: '/api/reference/garment-accessories', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'GarmentAccessory', id: 'LIST' }],
    }),
    updateGarmentAccessory: build.mutation<void, { id: number; body: UpdateAccessoryBody }>({
      query: ({ id, body }) => ({
        url: `/api/reference/garment-accessories/${id}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'GarmentAccessory', id },
              { type: 'GarmentAccessory', id: 'LIST' },
            ],
    }),
    deleteGarmentAccessory: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/garment-accessories/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'GarmentAccessory', id },
              { type: 'GarmentAccessory', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateGarmentAccessoryMutation,
  useDeleteGarmentAccessoryMutation,
  useListGarmentAccessoriesQuery,
  useUpdateGarmentAccessoryMutation,
} = garmentAccessoriesApi;
