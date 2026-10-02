import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapFabrics } from '../../mappers/fabrics/fabrics.mapper';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type { operations } from '@admin/shared/contracts';

type CreateFabricBody = operations['createFabric']['requestBody']['content']['application/json'];
type UpdateFabricBody = operations['updateFabric']['requestBody']['content']['application/json'];

export const fabricsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listFabrics: build.query<ReturnType<typeof mapFabrics>, void>({
      query: () => '/api/reference/fabrics',
      transformResponse: mapFabrics,
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'Fabric', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Fabric' as const, id })) ?? []),
      ],
    }),
    createFabric: build.mutation<void, CreateFabricBody>({
      query: (body) => ({ url: '/api/reference/fabrics', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Fabric', id: 'LIST' }]),
    }),
    updateFabric: build.mutation<void, { id: number; body: UpdateFabricBody }>({
      query: ({ id, body }) => ({ url: `/api/reference/fabrics/${id}`, method: 'PUT', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'Fabric', id },
              { type: 'Fabric', id: 'LIST' },
            ],
    }),
    deleteFabric: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/fabrics/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'Fabric', id },
              { type: 'Fabric', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateFabricMutation,
  useDeleteFabricMutation,
  useListFabricsQuery,
  useUpdateFabricMutation,
} = fabricsApi;
