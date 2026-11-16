import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { productPricesTag } from '../../cache/product-prices-tag';
import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapFabrics } from '../../mappers/fabrics/fabrics.mapper';
import { parseFabricsResponse } from '../../validators/fabrics/fabrics-response';

import type { CreateFabricBody, UpdateFabricBody } from '../../contracts/fabrics/fabrics-response';
import type { Fabric } from '@admin/references/model';

export const fabricsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listFabrics: build.query<Fabric[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/fabrics', { signal }),
          (value: unknown) => mapFabrics(parseFabricsResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      providesTags: (result) => [
        { type: 'Fabric', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Fabric' as const, id })) ?? []),
      ],
    }),
    createFabric: build.mutation<void, CreateFabricBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/reference/fabrics', { body: body, signal }),
          () => undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [productPricesTag, { type: 'Fabric', id: 'LIST' }],
    }),
    updateFabric: build.mutation<void, { id: number; body: UpdateFabricBody }>({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reference/fabrics/{id}', {
            params: { path: { id: id } },
            body: body,
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [productPricesTag, { type: 'Fabric', id }, { type: 'Fabric', id: 'LIST' }],
    }),
    deleteFabric: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reference/fabrics/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
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
