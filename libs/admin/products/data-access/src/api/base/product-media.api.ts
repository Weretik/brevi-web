import {
  adminApi,
  apiCall,
  apiClient,
  formDataBody,
  toAdminApiError,
} from '@admin/shared/api-client';

import { productErrorMessages } from './product-api.shared';
import { mapProductMedia, mapProductMediaPage } from '../../mappers/product/catalog-media.mapper';

import type { ProductMedia } from '@admin/products/model';

/** The photo library pages by 100 at most; the product editor still needs the whole list. */
const LIBRARY_PAGE_SIZE = 100;

export const productMediaApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listProductMedia: build.query<ProductMedia[], void>({
      async queryFn(_arg, { signal }) {
        const items: ProductMedia[] = [];
        try {
          for (let page = 1; ; page++) {
            const response = await apiCall(
              apiClient.GET('/api/media/files', {
                params: { query: { page, pageSize: LIBRARY_PAGE_SIZE } },
                signal,
              }),
              mapProductMediaPage,
              (error) => toAdminApiError(error, productErrorMessages),
            );
            if ('error' in response) return response;
            const result = response.data;
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
      queryFn: (file, { signal }) =>
        apiCall(
          apiClient.POST('/api/media/files', { ...formDataBody({ file }), signal }),
          (payload: unknown) => mapProductMedia(payload).id,
          (response) => toAdminApiError(response, productErrorMessages),
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Media', id: 'LIST' }]),
    }),
  }),
});

export const {
  useLazyListProductMediaQuery,
  useListProductMediaQuery,
  useUploadProductMediaMutation,
} = productMediaApi;
