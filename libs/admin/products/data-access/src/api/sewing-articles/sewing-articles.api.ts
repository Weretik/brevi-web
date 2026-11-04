import { adminApi } from '@admin/shared/api-client';

import { mapSewingArticles } from '../../mappers/sewing-articles/sewing-article-list.mapper';
import { mapSewingArticle } from '../../mappers/sewing-articles/sewing-article.mapper';
import {
  mapCreateSewingArticleRequest,
  mapUpdateSewingArticleRequest,
} from '../../mappers/sewing-articles/sewing-variant-request.mapper';
import { sewingCompositionTag } from '../sewing-composition/sewing-composition.cache';
import { sewingCompositionError } from '../sewing-composition/sewing-composition.errors';

import type {
  CreateSewingArticleArguments,
  DeleteSewingArticleArguments,
  UpdateSewingArticleArguments,
} from '../../models/sewing-articles/create-sewing-article-arguments';
import type { SewingArticle, SewingArticleList } from '@admin/products/model';

/** A variant write changes the model's prices and the «Товари» row. */
const changed = (productId: number) => [
  sewingCompositionTag(productId),
  { type: 'Product' as const, id: productId },
  { type: 'Product' as const, id: 'LIST' },
];

/** Fabric variants of a sewing model (CAT-015). */
export const sewingArticlesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listSewingArticles: build.query<SewingArticleList, number>({
      query: (id) => `/api/v1/products/${id}/articles`,
      transformResponse: mapSewingArticles,
      transformErrorResponse: sewingCompositionError,
      providesTags: (_result, _error, id) => [sewingCompositionTag(id)],
    }),
    createSewingArticle: build.mutation<SewingArticle, CreateSewingArticleArguments>({
      query: ({ productId, input }) => ({
        url: `/api/v1/products/${productId}/articles`,
        method: 'POST',
        body: mapCreateSewingArticleRequest(input),
      }),
      transformResponse: mapSewingArticle,
      transformErrorResponse: sewingCompositionError,
      invalidatesTags: (_result, error, { productId }) => (error ? [] : changed(productId)),
    }),
    updateSewingArticle: build.mutation<SewingArticle, UpdateSewingArticleArguments>({
      query: ({ productId, articleId, input }) => ({
        url: `/api/v1/products/${productId}/articles/${articleId}`,
        method: 'PUT',
        body: mapUpdateSewingArticleRequest(input),
      }),
      transformResponse: mapSewingArticle,
      transformErrorResponse: sewingCompositionError,
      invalidatesTags: (_result, error, { productId }) => (error ? [] : changed(productId)),
    }),
    deleteSewingArticle: build.mutation<void, DeleteSewingArticleArguments>({
      query: ({ productId, articleId, expectedVersion }) => ({
        url: `/api/v1/products/${productId}/articles/${articleId}?expectedVersion=${expectedVersion}`,
        method: 'DELETE',
      }),
      transformErrorResponse: sewingCompositionError,
      invalidatesTags: (_result, error, { productId }) => (error ? [] : changed(productId)),
    }),
  }),
});
export const {
  useListSewingArticlesQuery,
  useCreateSewingArticleMutation,
  useUpdateSewingArticleMutation,
  useDeleteSewingArticleMutation,
} = sewingArticlesApi;
