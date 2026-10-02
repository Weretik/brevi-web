import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { productErrorMessages } from './product-api.shared';
import { mapProductMedia } from '../mappers/catalog-media.mapper';

import type { operations } from '@admin/shared/contracts';

type UploadMediaResponse =
  operations['uploadCatalogMedia']['responses'][200]['content']['application/json'];

export const productMediaApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductMedia: build.query<ReturnType<typeof mapProductMedia>, void>({
      query: () => '/api/catalog/media',
      transformResponse: mapProductMedia,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      providesTags: (result) => [
        { type: 'Media', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Media' as const, id })) ?? []),
      ],
    }),
    uploadProductMedia: build.mutation<number, File>({
      query: (file) => {
        const body = new FormData();
        body.set('file', file);
        return { url: '/api/catalog/media', method: 'POST', body };
      },
      transformResponse: (payload: unknown) => {
        if (!payload || typeof payload !== 'object')
          throw new Error('Некоректна відповідь завантаження.');
        const media = payload as Record<string, unknown>;
        if (
          typeof media['mediaFileId'] !== 'number' ||
          !Number.isInteger(media['mediaFileId']) ||
          media['mediaFileId'] < 1 ||
          typeof media['storageKey'] !== 'string' ||
          typeof media['publicUrl'] !== 'string' ||
          typeof media['contentType'] !== 'string' ||
          typeof media['originalFileName'] !== 'string'
        )
          throw new Error('Некоректна відповідь завантаження.');
        return (media as UploadMediaResponse).mediaFileId;
      },
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Media', id: 'LIST' }]),
    }),
    deleteProductMedia: build.mutation<void, number>({
      query: (id) => ({ url: `/api/catalog/media/${id}`, method: 'DELETE' }),
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      invalidatesTags: (_result, error, id) =>
        error
          ? []
          : [
              { type: 'Media', id },
              { type: 'Media', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useDeleteProductMediaMutation,
  useLazyListProductMediaQuery,
  useListProductMediaQuery,
  useUploadProductMediaMutation,
} = productMediaApi;
