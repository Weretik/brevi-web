import { apiCall, apiClient } from '@admin/shared/api-client';

import { siteCategoriesTag, siteCategoryTag } from '../../cache/site-category-tags';
import { siteCategoryApiError } from '../../errors/site/site-category-api-error';
import { mapSiteCategoryImportReport } from '../../mappers/product-pages/old-site-import.mapper';
import {
  mapSiteCategory,
  mapSiteCategoryList,
  mapSiteCategoryVisibility,
} from '../../mappers/site-categories/site-category.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type {
  OldSiteImportItems,
  OldSiteImportOptions,
  SiteCategory,
  SiteCategoryImportReport,
  SiteCategoryInput,
  SiteCategoryRow,
  SiteCategoryVisibility,
} from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteCategory']['requestBody']['content']['application/json'];
type VisibilityBody =
  operations['setSiteCategoryVisibility']['requestBody']['content']['application/json'];
type ImportBody =
  operations['importOldSiteCategories']['requestBody']['content']['application/json'];
type OrderBody = operations['reorderSiteCategories']['requestBody']['content']['application/json'];

export function siteCategoryEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteCategories: build.query<SiteCategoryRow[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/categories', { signal }),
          mapSiteCategoryList,
          siteCategoryApiError,
        ),
      providesTags: [siteCategoriesTag],
    }),
    getSiteCategory: build.query<SiteCategory, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/categories/{id}', { params: { path: { id: id } }, signal }),
          mapSiteCategory,
          siteCategoryApiError,
        ),
      providesTags: (_result, _error, id) => [siteCategoryTag(id)],
    }),
    /** Creates a category when `id` is null, otherwise replaces it as a whole. */
    saveSiteCategory: build.mutation<SiteCategory, SiteCategoryInput>({
      queryFn: ({ id, ...input }, { signal }) =>
        apiCall(
          id === null
            ? apiClient.POST('/api/content/categories', { body: input satisfies SaveBody, signal })
            : apiClient.PUT('/api/content/categories/{id}', {
                params: { path: { id } },
                body: input satisfies SaveBody,
                signal,
              }),
          mapSiteCategory,
          siteCategoryApiError,
        ),
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, { id }) =>
        id === null ? [siteCategoriesTag] : [siteCategoriesTag, siteCategoryTag(id)],
    }),
    setSiteCategoryVisibility: build.mutation<
      SiteCategoryVisibility,
      { id: number; showOnSite: boolean }
    >({
      queryFn: ({ id, showOnSite }, { signal }) =>
        apiCall(
          apiClient.PATCH('/api/content/categories/{id}/visibility', {
            params: { path: { id: id } },
            body: { showOnSite } satisfies VisibilityBody,
            signal,
          }),
          mapSiteCategoryVisibility,
          siteCategoryApiError,
        ),
      invalidatesTags: (_result, _error, { id }) => [siteCategoriesTag, siteCategoryTag(id)],
    }),
    reorderSiteCategories: build.mutation<void, { parentId: number | null; ids: number[] }>({
      queryFn: (order, { signal }) =>
        apiCall(
          apiClient.PUT('/api/content/categories/order', {
            body: order satisfies OrderBody,
            signal,
          }),
          undefined,
          siteCategoryApiError,
        ),
      invalidatesTags: [siteCategoriesTag],
    }),
    deleteSiteCategory: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/content/categories/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          siteCategoryApiError,
        ),
      invalidatesTags: (_result, _error, id) => [siteCategoriesTag, siteCategoryTag(id)],
    }),
    /** One-time transfer of the old-site category tree: a check (`dryRun`) or the transfer itself. */
    importOldSiteCategories: build.mutation<
      SiteCategoryImportReport,
      OldSiteImportOptions & { items: OldSiteImportItems; dryRun: boolean }
    >({
      queryFn: ({ items, dryRun, showOnSite, overwrite }, { signal }) =>
        apiCall(
          apiClient.POST('/api/content/categories/old-site-import', {
            body: { items: items as unknown as ImportBody['items'], dryRun, showOnSite, overwrite },
            signal,
          }),
          mapSiteCategoryImportReport,
          siteCategoryApiError,
        ),
      // A transfer changes the tree and the categories of products.
      invalidatesTags: (report) =>
        report && !report.dryRun ? ['SiteCategory', 'ContentProduct'] : [],
    }),
  };
}
