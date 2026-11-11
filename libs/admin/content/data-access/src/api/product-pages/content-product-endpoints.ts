import { contentProductTag, contentProductsTag } from '../../cache/content-product-tags';
import { contentApiError } from '../../errors/content-api-error';
import {
  mapContentProduct,
  mapContentProductPage,
  mapContentProductVisibility,
} from '../../mappers/product-pages/content-product.mapper';
import { mapOldSiteImportReport } from '../../mappers/product-pages/old-site-import.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type {
  ContentProduct,
  ContentProductInput,
  ContentProductPage,
  ContentProductQuery,
  ContentProductVisibility,
  OldSiteImportItems,
  OldSiteImportOptions,
  OldSiteImportReport,
} from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveContentProduct']['requestBody']['content']['application/json'];
type VisibilityBody =
  operations['setContentProductVisibility']['requestBody']['content']['application/json'];

type ImportBody =
  operations['importOldSiteProductPages']['requestBody']['content']['application/json'];

export function contentProductEndpoints(build: ContentEndpointBuilder) {
  return {
    getContentProducts: build.query<ContentProductPage, ContentProductQuery>({
      query: ({ page, pageSize, search, type, site, category }) => ({
        url: '/api/content/products',
        params: {
          page,
          pageSize,
          search: search || undefined,
          type: type ?? undefined,
          onSite: site === 'all' ? undefined : site === 'onSite',
          categoryId: category ?? undefined,
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
      // A stale revision means someone else saved: reload either way. Categories count their products.
      invalidatesTags: (_result, _error, { productId }) => [
        contentProductsTag,
        contentProductTag(productId),
        'SiteCategory',
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
    /** One-time transfer of old-site texts and SEO: a check (`dryRun`) or the transfer itself. */
    importOldSiteProductPages: build.mutation<
      OldSiteImportReport,
      OldSiteImportOptions & { items: OldSiteImportItems; dryRun: boolean }
    >({
      query: ({ items, dryRun, showOnSite, overwrite }) => ({
        url: '/api/content/products/old-site-import',
        method: 'POST',
        // The file is passed as it is; the server checks every page.
        body: { items: items as unknown as ImportBody['items'], dryRun, showOnSite, overwrite },
      }),
      transformResponse: mapOldSiteImportReport,
      transformErrorResponse: contentApiError,
      // A transfer changes many pages: reload the list and every opened page.
      invalidatesTags: (report) => (report && !report.dryRun ? ['ContentProduct'] : []),
    }),
  };
}
