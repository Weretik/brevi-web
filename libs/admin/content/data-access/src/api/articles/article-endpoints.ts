import { apiCall, apiClient } from '@admin/shared/api-client';

import { articleTag, articlesTag } from '../../cache/article-tags';
import { articleApiError } from '../../errors/publishing/article-api-error';
import {
  mapArticle,
  mapArticleList,
  mapArticleVisibility,
} from '../../mappers/articles/article.mapper';
import { mapArticleImportReport } from '../../mappers/product-pages/old-site-import.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type {
  Article,
  ArticleImportReport,
  ArticleInput,
  ArticleRow,
  ArticleVisibility,
  OldSiteImportItems,
  OldSiteImportOptions,
} from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveContentArticle']['requestBody']['content']['application/json'];
type VisibilityBody =
  operations['setContentArticleVisibility']['requestBody']['content']['application/json'];
type ImportBody = operations['importOldSiteArticles']['requestBody']['content']['application/json'];

export function articleEndpoints(build: ContentEndpointBuilder) {
  return {
    getContentArticles: build.query<ArticleRow[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/articles', { signal }),
          mapArticleList,
          articleApiError,
        ),
      providesTags: [articlesTag],
    }),
    getContentArticle: build.query<Article, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/articles/{id}', { params: { path: { id: id } }, signal }),
          mapArticle,
          articleApiError,
        ),
      providesTags: (_result, _error, id) => [articleTag(id)],
    }),
    /** Creates an article when `id` is null, otherwise replaces it as a whole. */
    saveContentArticle: build.mutation<Article, ArticleInput>({
      queryFn: ({ id, ...input }, { signal }) =>
        apiCall(
          id === null
            ? apiClient.POST('/api/content/articles', { body: input satisfies SaveBody, signal })
            : apiClient.PUT('/api/content/articles/{id}', {
                params: { path: { id } },
                body: input satisfies SaveBody,
                signal,
              }),
          mapArticle,
          articleApiError,
        ),
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, { id }) =>
        id === null ? [articlesTag] : [articlesTag, articleTag(id)],
    }),
    setContentArticleVisibility: build.mutation<
      ArticleVisibility,
      { id: number; showOnSite: boolean }
    >({
      queryFn: ({ id, showOnSite }, { signal }) =>
        apiCall(
          apiClient.PATCH('/api/content/articles/{id}/visibility', {
            params: { path: { id: id } },
            body: { showOnSite } satisfies VisibilityBody,
            signal,
          }),
          mapArticleVisibility,
          articleApiError,
        ),
      invalidatesTags: (_result, _error, { id }) => [articlesTag, articleTag(id)],
    }),
    deleteContentArticle: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/content/articles/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          articleApiError,
        ),
      invalidatesTags: (_result, _error, id) => [articlesTag, articleTag(id)],
    }),
    /** One-time transfer of old-site articles: a check (`dryRun`) or the transfer of one part of the file. */
    importOldSiteArticles: build.mutation<
      ArticleImportReport,
      OldSiteImportOptions & { items: OldSiteImportItems; dryRun: boolean }
    >({
      queryFn: ({ items, dryRun, showOnSite, overwrite }, { signal }) =>
        apiCall(
          apiClient.POST('/api/content/articles/old-site-import', {
            body: { items: items as unknown as ImportBody['items'], dryRun, showOnSite, overwrite },
            signal,
          }),
          mapArticleImportReport,
          articleApiError,
        ),
      invalidatesTags: (report) => (report && !report.dryRun ? ['ContentArticle'] : []),
    }),
  };
}
