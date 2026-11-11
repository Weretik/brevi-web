import { contentProductTag, contentProductsTag } from '../../cache/content-product-tags';
import { contentApiError } from '../../errors/content-api-error';
import {
  mapContentProduct,
  mapContentProductPage,
  mapContentProductVisibility,
} from '../../mappers/product-pages/content-product.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type {
  ContentProduct,
  ContentProductInput,
  ContentProductPage,
  ContentProductQuery,
  ContentProductVisibility,
} from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveContentProduct']['requestBody']['content']['application/json'];
type VisibilityBody =
  operations['setContentProductVisibility']['requestBody']['content']['application/json'];

export function contentProductEndpoints(build: ContentEndpointBuilder) {
  return {
    getContentProducts: build.query<ContentProductPage, ContentProductQuery>({
      query: ({ page, pageSize, search, type, site }) => ({
        url: '/api/content/products',
        params: {
          page,
          pageSize,
          search: search || undefined,
          type: type ?? undefined,
          onSite: site === 'all' ? undefined : site === 'onSite',
        },
      }),
      transformResponse: mapContentProductPage,
      transformErrorResponse: contentApiError,
      providesTags: [contentProductsTag],
    }),
    getContentProduct: build.query<ContentProduct, number>({
      query: (productId) => ({ url: `/api/content/products/${productId}` }),
      transformResponse: mapContentProduct,
      transformErrorResponse: contentApiError,
      providesTags: (_result, _error, productId) => [contentProductTag(productId)],
    }),
    saveContentProduct: build.mutation<ContentProduct, ContentProductInput>({
      query: ({ productId, ...input }) => ({
        url: `/api/content/products/${productId}`,
        method: 'PUT',
        body: input satisfies SaveBody,
      }),
      transformResponse: mapContentProduct,
      transformErrorResponse: contentApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, { productId }) => [
        contentProductsTag,
        contentProductTag(productId),
      ],
    }),
    setContentProductVisibility: build.mutation<
      ContentProductVisibility,
      { productId: number; showOnSite: boolean }
    >({
      query: ({ productId, showOnSite }) => ({
        url: `/api/content/products/${productId}/visibility`,
        method: 'PATCH',
        body: { showOnSite } satisfies VisibilityBody,
      }),
      transformResponse: mapContentProductVisibility,
      transformErrorResponse: contentApiError,
      invalidatesTags: (_result, _error, { productId }) => [
        contentProductsTag,
        contentProductTag(productId),
      ],
    }),
    deleteContentProduct: build.mutation<void, number>({
      query: (productId) => ({ url: `/api/content/products/${productId}`, method: 'DELETE' }),
      transformErrorResponse: contentApiError,
      invalidatesTags: (_result, _error, productId) => [
        contentProductsTag,
        contentProductTag(productId),
      ],
    }),
  };
}
