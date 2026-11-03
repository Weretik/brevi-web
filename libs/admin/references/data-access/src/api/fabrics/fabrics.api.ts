import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapFabrics } from '../../mappers/fabrics/fabrics.mapper';
import { parseFabricsResponse } from '../../validators/fabrics/fabrics-response';
import { referenceErrorMessages, productPricesTag } from '../shared/reference-api.shared';

import type { CreateFabricBody, UpdateFabricBody } from '../../contracts/fabrics/fabrics-response';
import type { Fabric } from '@admin/references/model';

export const fabricsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listFabrics: build.query<Fabric[], void>({
      query: () => '/api/reference/fabrics',
      transformResponse: (value: unknown) => mapFabrics(parseFabricsResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: 'Fabric', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Fabric' as const, id })) ?? []),
      ],
    }),
    createFabric: build.mutation<void, CreateFabricBody>({
      query: (body) => ({ url: '/api/reference/fabrics', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) =>
        error ? [] : [productPricesTag, { type: 'Fabric', id: 'LIST' }],
    }),
    updateFabric: build.mutation<void, { id: number; body: UpdateFabricBody }>({
      query: ({ id, body }) => ({ url: `/api/reference/fabrics/${id}`, method: 'PUT', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [productPricesTag, { type: 'Fabric', id }, { type: 'Fabric', id: 'LIST' }],
    }),
    deleteFabric: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/fabrics/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error ? [] : [productPricesTag, { type: 'Fabric', id }, { type: 'Fabric', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateFabricMutation,
  useDeleteFabricMutation,
  useListFabricsQuery,
  useUpdateFabricMutation,
} = fabricsApi;
