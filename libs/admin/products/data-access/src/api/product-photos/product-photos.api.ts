import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapProductPhotos } from '../../mappers/product-photos/product-photos.mapper';
import { parseProductPhotoList } from '../../validators/product-photos/validate-product-photos';
import { productErrorMessages } from '../product-api.shared';

import type { SetProductPhotosBody } from '../../contracts/product-photos/product-photos.dto';
import type { ProductCardPhoto } from '@admin/products/model';

const tag = 'Product' as const;
const photosTag = (id: number) => ({ type: tag, id: `photos-${id}` });

/** The card tab «Фото» (CAT-018). */
export const productPhotosApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getProductPhotos: build.query<ProductCardPhoto[], number>({
      query: (id) => `/api/v1/products/${id}/photos`,
      transformResponse: (value: unknown) => mapProductPhotos(parseProductPhotoList(value)),
      transformErrorResponse: (error) => toAdminApiError(error, productErrorMessages),
      providesTags: (_result, _error, id) => [photosTag(id)],
    }),
    setProductPhotos: build.mutation<
      ProductCardPhoto[],
      { id: number; body: SetProductPhotosBody }
    >({
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
  }),
});

export const { useGetProductPhotosQuery, useSetProductPhotosMutation } = productPhotosApi;
