import { apiCall, apiClient } from '@admin/shared/api-client';

import { contentProductTag, contentProductsTag } from '../../cache/content-product-tags';
import { contentApiError } from '../../errors/site/content-api-error';
import {
  mapContentProduct,
  mapContentProductPage,
  mapContentProductVisibility,
} from '../../mappers/product-pages/content-product.mapper';
import { mapOldSiteImportReport } from '../../mappers/product-pages/old-site-import.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
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
      queryFn: ({ page, pageSize, search, type, site, category }, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/products', {
            params: {
              query: {
                page,
                pageSize,
                search: search || undefined,
                type: type ?? undefined,
                onSite: site === 'all' ? undefined : site === 'onSite',
                categoryId: category ?? undefined,
              },
            },
            signal,
          }),
          mapContentProductPage,
          contentApiError,
        ),
      providesTags: [contentProductsTag],
    }),
    getContentProduct: build.query<ContentProduct, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/products/{productId}', {
            params: { path: { productId: productId } },
            signal,
          }),
          mapContentProduct,
          contentApiError,
        ),
      providesTags: (_result, _error, productId) => [contentProductTag(productId)],
    }),
    saveContentProduct: build.mutation<ContentProduct, ContentProductInput>({
      queryFn: ({ productId, ...input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/content/products/{productId}', {
            params: { path: { productId: productId } },
            body: input satisfies SaveBody,
            signal,
          }),
          mapContentProduct,
          contentApiError,
        ),
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
      queryFn: ({ productId, showOnSite }, { signal }) =>
        apiCall(
          apiClient.PATCH('/api/content/products/{productId}/visibility', {
            params: { path: { productId: productId } },
            body: { showOnSite } satisfies VisibilityBody,
            signal,
          }),
          mapContentProductVisibility,
          contentApiError,
        ),
      invalidatesTags: (_result, _error, { productId }) => [
        contentProductsTag,
        contentProductTag(productId),
      ],
    }),
    deleteContentProduct: build.mutation<void, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/content/products/{productId}', {
            params: { path: { productId: productId } },
            signal,
          }),
          undefined,
          contentApiError,
        ),
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
      queryFn: ({ items, dryRun, showOnSite, overwrite }, { signal }) =>
        apiCall(
          apiClient.POST('/api/content/products/old-site-import', {
            body: { items: items as unknown as ImportBody['items'], dryRun, showOnSite, overwrite },
            signal,
          }),
          mapOldSiteImportReport,
          contentApiError,
        ),
      // A transfer changes many pages: reload the list and every opened page.
      invalidatesTags: (report) => (report && !report.dryRun ? ['ContentProduct'] : []),
    }),
  };
}
