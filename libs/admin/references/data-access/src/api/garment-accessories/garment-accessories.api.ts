import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapGarmentAccessories } from '../../mappers/garment-accessories/garment-accessories.mapper';
import { parseGarmentAccessoriesResponse } from '../../validators/garment-accessories/garment-accessories-response';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type {
  CreateGarmentAccessoryBody,
  UpdateGarmentAccessoryBody,
} from '../../contracts/garment-accessories/garment-accessories-response';
import type { GarmentAccessory } from '@admin/references/model';

export const garmentAccessoriesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listGarmentAccessories: build.query<GarmentAccessory[], void>({
      query: () => '/api/reference/garment-accessories',
      transformResponse: (value: unknown) =>
        mapGarmentAccessories(parseGarmentAccessoriesResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'GarmentAccessory', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'GarmentAccessory' as const, id })) ?? []),
      ],
    }),
    createGarmentAccessory: build.mutation<void, CreateGarmentAccessoryBody>({
      query: (body) => ({ url: '/api/reference/garment-accessories', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'GarmentAccessory', id: 'LIST' }],
    }),
    updateGarmentAccessory: build.mutation<void, { id: number; body: UpdateGarmentAccessoryBody }>({
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
