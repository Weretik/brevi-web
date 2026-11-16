import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapFabricColors } from '../../mappers/fabric-colors/fabric-colors.mapper';
import { parseFabricColorsResponse } from '../../validators/fabric-colors/fabric-colors-response';

import type { FabricColorBody } from '../../contracts/fabric-colors/fabric-colors-response';
import type { FabricColor } from '@admin/references/model';

const tag = 'FabricColor' as const;

export const fabricColorsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listFabricColors: build.query<FabricColor[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reference/fabric-colors', { signal }),
          (value: unknown) => mapFabricColors(parseFabricColorsResponse(value)),
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createFabricColor: build.mutation<number, FabricColorBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/reference/fabric-colors', { body: body, signal }),
          undefined,
          (error) => toAdminApiError(error, referenceErrorMessages),
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    updateFabricColor: build.mutation<void, { id: number; body: FabricColorBody }>({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reference/fabric-colors/{id}', {
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
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
    deleteFabricColor: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reference/fabric-colors/{id}', {
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
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useCreateFabricColorMutation,
  useDeleteFabricColorMutation,
  useListFabricColorsQuery,
  useUpdateFabricColorMutation,
} = fabricColorsApi;
