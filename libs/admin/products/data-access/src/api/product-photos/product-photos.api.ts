import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import {
  mapOldSitePhotoImportReport,
  mapProductPhotos,
} from '../../mappers/product-photos/product-photos.mapper';
import {
  parseOldSitePhotoImportReport,
  parseProductPhotoList,
} from '../../validators/product-photos/validate-product-photos';
import { productErrorMessages } from '../product-api.shared';

import type {
  ImportOldSitePhotosBody,
  SetProductPhotosBody,
} from '../../contracts/product-photos/product-photos.dto';
import type { OldSitePhotoImportReport, ProductPhoto } from '@admin/products/model';

const tag = 'Product' as const;
const photosTag = (id: number) => ({ type: tag, id: `photos-${id}` });

/** The card tab «Фото» and the old-site photo import (CAT-018). */
export const productPhotosApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getProductPhotos: build.query<ProductPhoto[], number>({
      query: (id) => `/api/v1/products/${id}/photos`,
      transformResponse: (value: unknown) => mapProductPhotos(parseProductPhotoList(value)),
      transformErrorResponse: (error) => toAdminApiError(error, productErrorMessages),
      providesTags: (_result, _error, id) => [photosTag(id)],
    }),
    setProductPhotos: build.mutation<ProductPhoto[], { id: number; body: SetProductPhotosBody }>({
      query: ({ id, body }) => ({ url: `/api/v1/products/${id}/photos`, method: 'PUT', body }),
      transformResponse: (value: unknown) => mapProductPhotos(parseProductPhotoList(value)),
      transformErrorResponse: (error) => toAdminApiError(error, productErrorMessages),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(productPhotosApi.util.upsertQueryData('getProductPhotos', id, data));
        } catch {
          // The error reaches the caller through unwrap().
        }
      },
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: tag, id },
              { type: tag, id: 'LIST' },
            ],
    }),
    importOldSitePhotos: build.mutation<OldSitePhotoImportReport, ImportOldSitePhotosBody>({
      query: (body) => ({ url: '/api/v1/products/old-site-photo-import', method: 'POST', body }),
      transformResponse: (value: unknown) =>
        mapOldSitePhotoImportReport(parseOldSitePhotoImportReport(value)),
      transformErrorResponse: (error) => toAdminApiError(error, productErrorMessages),
      invalidatesTags: (result) =>
        result && !result.dryRun ? [tag, { type: 'Media' as const, id: 'LIST' }] : [],
    }),
  }),
});

export const {
  useGetProductPhotosQuery,
  useSetProductPhotosMutation,
  useImportOldSitePhotosMutation,
} = productPhotosApi;
