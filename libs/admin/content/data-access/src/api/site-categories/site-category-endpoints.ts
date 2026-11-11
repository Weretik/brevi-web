import { siteCategoriesTag, siteCategoryTag } from '../../cache/site-category-tags';
import { siteCategoryApiError } from '../../errors/site-category-api-error';
import { mapSiteCategoryImportReport } from '../../mappers/product-pages/old-site-import.mapper';
import {
  mapSiteCategory,
  mapSiteCategoryList,
  mapSiteCategoryVisibility,
} from '../../mappers/site-categories/site-category.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
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
      query: () => ({ url: '/api/content/categories' }),
      transformResponse: mapSiteCategoryList,
      transformErrorResponse: siteCategoryApiError,
      providesTags: [siteCategoriesTag],
    }),
    getSiteCategory: build.query<SiteCategory, number>({
      query: (id) => ({ url: `/api/content/categories/${id}` }),
      transformResponse: mapSiteCategory,
      transformErrorResponse: siteCategoryApiError,
      providesTags: (_result, _error, id) => [siteCategoryTag(id)],
    }),
    /** Creates a category when `id` is null, otherwise replaces it as a whole. */
    saveSiteCategory: build.mutation<SiteCategory, SiteCategoryInput>({
      query: ({ id, ...input }) => ({
        url: id === null ? '/api/content/categories' : `/api/content/categories/${id}`,
        method: id === null ? 'POST' : 'PUT',
        body: input satisfies SaveBody,
      }),
      transformResponse: mapSiteCategory,
      transformErrorResponse: siteCategoryApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, { id }) =>
        id === null ? [siteCategoriesTag] : [siteCategoriesTag, siteCategoryTag(id)],
    }),
    setSiteCategoryVisibility: build.mutation<
      SiteCategoryVisibility,
      { id: number; showOnSite: boolean }
    >({
      query: ({ id, showOnSite }) => ({
        url: `/api/content/categories/${id}/visibility`,
        method: 'PATCH',
        body: { showOnSite } satisfies VisibilityBody,
      }),
      transformResponse: mapSiteCategoryVisibility,
      transformErrorResponse: siteCategoryApiError,
      invalidatesTags: (_result, _error, { id }) => [siteCategoriesTag, siteCategoryTag(id)],
    }),
    reorderSiteCategories: build.mutation<void, { parentId: number | null; ids: number[] }>({
      query: (order) => ({
        url: '/api/content/categories/order',
        method: 'PUT',
        body: order satisfies OrderBody,
      }),
      transformErrorResponse: siteCategoryApiError,
      invalidatesTags: [siteCategoriesTag],
    }),
    deleteSiteCategory: build.mutation<void, number>({
      query: (id) => ({ url: `/api/content/categories/${id}`, method: 'DELETE' }),
      transformErrorResponse: siteCategoryApiError,
      invalidatesTags: (_result, _error, id) => [siteCategoriesTag, siteCategoryTag(id)],
    }),
    /** One-time transfer of the old-site category tree: a check (`dryRun`) or the transfer itself. */
    importOldSiteCategories: build.mutation<
      SiteCategoryImportReport,
      OldSiteImportOptions & { items: OldSiteImportItems; dryRun: boolean }
    >({
      query: ({ items, dryRun, showOnSite, overwrite }) => ({
        url: '/api/content/categories/old-site-import',
        method: 'POST',
        // The file is passed as it is; the server checks every category.
        body: { items: items as unknown as ImportBody['items'], dryRun, showOnSite, overwrite },
      }),
      transformResponse: mapSiteCategoryImportReport,
      transformErrorResponse: siteCategoryApiError,
      // A transfer changes the tree and the categories of products.
      invalidatesTags: (report) =>
        report && !report.dryRun ? ['SiteCategory', 'ContentProduct'] : [],
    }),
  };
}
