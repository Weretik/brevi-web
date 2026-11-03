import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { productErrorMessages } from './product-api.shared';
import { mapProductMedia, mapProductMediaPage } from '../mappers/catalog-media.mapper';

import type { ProductMedia } from '@admin/products/model';

/** The photo library pages by 100 at most; the product editor still needs the whole list. */
const LIBRARY_PAGE_SIZE = 100;

export const productMediaApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductMedia: build.query<ProductMedia[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const items: ProductMedia[] = [];
        try {
          for (let page = 1; ; page++) {
            const response = await baseQuery(
              `/api/media/files?page=${page}&pageSize=${LIBRARY_PAGE_SIZE}`,
            );
            if (response.error)
              return { error: toAdminApiError(response.error, productErrorMessages) };
            const result = mapProductMediaPage(response.data);
            items.push(...result.items);
            if (result.items.length === 0 || items.length >= result.total) return { data: items };
          }
        } catch (cause) {
          return { error: toAdminApiError(cause, productErrorMessages) };
        }
      },
      providesTags: (result) => [
        { type: 'Media', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Media' as const, id })) ?? []),
      ],
    }),
    uploadProductMedia: build.mutation<number, File>({
      query: (file) => {
        const body = new FormData();
        body.set('file', file);
        return { url: '/api/media/files', method: 'POST', body };
      },
      transformResponse: (payload: unknown) => mapProductMedia(payload).id,
      transformErrorResponse: (response) => toAdminApiError(response, productErrorMessages),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Media', id: 'LIST' }]),
    }),
  }),
});

export const {
  useLazyListProductMediaQuery,
  useListProductMediaQuery,
  useUploadProductMediaMutation,
} = productMediaApi;
