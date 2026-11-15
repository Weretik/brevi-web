import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

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
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{productId}/articles', {
            params: { path: { productId: id } },
            signal,
          }),
          mapSewingArticles,
          sewingCompositionError,
        ),
      providesTags: (_result, _error, id) => [sewingCompositionTag(id)],
    }),
    createSewingArticle: build.mutation<SewingArticle, CreateSewingArticleArguments>({
      queryFn: ({ productId, input }, { signal }) =>
        apiCall(
          apiClient.POST('/api/v1/products/{productId}/articles', {
            params: { path: { productId: productId } },
            body: mapCreateSewingArticleRequest(input),
            signal,
          }),
          mapSewingArticle,
          sewingCompositionError,
        ),
      invalidatesTags: (_result, error, { productId }) => (error ? [] : changed(productId)),
    }),
    updateSewingArticle: build.mutation<SewingArticle, UpdateSewingArticleArguments>({
      queryFn: ({ productId, articleId, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/v1/products/{productId}/articles/{articleId}', {
            params: { path: { productId: productId, articleId: articleId } },
            body: mapUpdateSewingArticleRequest(input),
            signal,
          }),
          mapSewingArticle,
          sewingCompositionError,
        ),
      invalidatesTags: (_result, error, { productId }) => (error ? [] : changed(productId)),
    }),
    deleteSewingArticle: build.mutation<void, DeleteSewingArticleArguments>({
      queryFn: ({ productId, articleId, expectedVersion }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/v1/products/{productId}/articles/{articleId}', {
            params: { path: { productId, articleId }, query: { expectedVersion } },
            signal,
          }),
          undefined,
          sewingCompositionError,
        ),
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
