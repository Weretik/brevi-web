import { articleTag, articlesTag } from '../../cache/article-tags';
import { articleApiError } from '../../errors/article-api-error';
import {
  mapArticle,
  mapArticleList,
  mapArticleVisibility,
} from '../../mappers/articles/article.mapper';
import { mapArticleImportReport } from '../../mappers/product-pages/old-site-import.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
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
      query: () => ({ url: '/api/content/articles' }),
      transformResponse: mapArticleList,
      transformErrorResponse: articleApiError,
      providesTags: [articlesTag],
    }),
    getContentArticle: build.query<Article, number>({
      query: (id) => ({ url: `/api/content/articles/${id}` }),
      transformResponse: mapArticle,
      transformErrorResponse: articleApiError,
      providesTags: (_result, _error, id) => [articleTag(id)],
    }),
    /** Creates an article when `id` is null, otherwise replaces it as a whole. */
    saveContentArticle: build.mutation<Article, ArticleInput>({
      query: ({ id, ...input }) => ({
        url: id === null ? '/api/content/articles' : `/api/content/articles/${id}`,
        method: id === null ? 'POST' : 'PUT',
        body: input satisfies SaveBody,
      }),
      transformResponse: mapArticle,
      transformErrorResponse: articleApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, { id }) =>
        id === null ? [articlesTag] : [articlesTag, articleTag(id)],
    }),
    setContentArticleVisibility: build.mutation<
      ArticleVisibility,
      { id: number; showOnSite: boolean }
    >({
      query: ({ id, showOnSite }) => ({
        url: `/api/content/articles/${id}/visibility`,
        method: 'PATCH',
        body: { showOnSite } satisfies VisibilityBody,
      }),
      transformResponse: mapArticleVisibility,
      transformErrorResponse: articleApiError,
      invalidatesTags: (_result, _error, { id }) => [articlesTag, articleTag(id)],
    }),
    deleteContentArticle: build.mutation<void, number>({
      query: (id) => ({ url: `/api/content/articles/${id}`, method: 'DELETE' }),
      transformErrorResponse: articleApiError,
      invalidatesTags: (_result, _error, id) => [articlesTag, articleTag(id)],
    }),
    /** One-time transfer of old-site articles: a check (`dryRun`) or the transfer of one part of the file. */
    importOldSiteArticles: build.mutation<
      ArticleImportReport,
      OldSiteImportOptions & { items: OldSiteImportItems; dryRun: boolean }
    >({
      query: ({ items, dryRun, showOnSite, overwrite }) => ({
        url: '/api/content/articles/old-site-import',
        method: 'POST',
        // The file is passed as it is; the server checks every article.
        body: { items: items as unknown as ImportBody['items'], dryRun, showOnSite, overwrite },
      }),
      transformResponse: mapArticleImportReport,
      transformErrorResponse: articleApiError,
      invalidatesTags: (report) => (report && !report.dryRun ? ['ContentArticle'] : []),
    }),
  };
}
