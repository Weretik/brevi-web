import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { referenceErrorMessages } from '../../errors/reference-error-messages';
import { mapFabricColors } from '../../mappers/fabric-colors/fabric-colors.mapper';
import { parseFabricColorsResponse } from '../../validators/fabric-colors/fabric-colors-response';

import type { FabricColorBody } from '../../contracts/fabric-colors/fabric-colors-response';
import type { FabricColor } from '@admin/references/model';

const tag = 'FabricColor' as const;

export const fabricColorsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listFabricColors: build.query<FabricColor[], void>({
      query: () => '/api/reference/fabric-colors',
      transformResponse: (value: unknown) => mapFabricColors(parseFabricColorsResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: (result) => [
        { type: tag, id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: tag, id })) ?? []),
      ],
    }),
    createFabricColor: build.mutation<number, FabricColorBody>({
      query: (body) => ({ url: '/api/reference/fabric-colors', method: 'POST', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    updateFabricColor: build.mutation<void, { id: number; body: FabricColorBody }>({
      query: ({ id, body }) => ({ url: `/api/reference/fabric-colors/${id}`, method: 'PUT', body }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
    deleteFabricColor: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reference/fabric-colors/${id}`, method: 'DELETE' }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
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
