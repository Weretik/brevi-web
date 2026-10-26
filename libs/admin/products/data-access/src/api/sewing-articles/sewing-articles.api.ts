import { adminApi } from '@admin/shared/api-client';

import { mapCreateSewingArticleRequest } from '../../mappers/sewing-articles/create-sewing-article-request.mapper';
import { mapSewingArticles } from '../../mappers/sewing-articles/sewing-article-list.mapper';
import { mapSewingArticle } from '../../mappers/sewing-articles/sewing-article.mapper';
import { sewingCompositionTag } from '../sewing-composition/sewing-composition.cache';
import { sewingCompositionError } from '../sewing-composition/sewing-composition.errors';

import type { CreateSewingArticleArguments } from '../../models/sewing-articles/create-sewing-article-arguments';
import type { SewingArticle, SewingArticleList } from '@admin/products/model';

export const sewingArticlesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listSewingArticles: build.query<SewingArticleList, number>({
      query: (id) => `/api/v1/products/${id}/articles`,
      transformResponse: mapSewingArticles,
      transformErrorResponse: sewingCompositionError,
      providesTags: (_result, _error, id) => [sewingCompositionTag(id)],
    }),
    createSewingArticle: build.mutation<SewingArticle, CreateSewingArticleArguments>({
      query: ({ productId, draft }) => ({
        url: `/api/v1/products/${productId}/articles`,
        method: 'POST',
        body: mapCreateSewingArticleRequest(draft),
      }),
      transformResponse: mapSewingArticle,
      transformErrorResponse: sewingCompositionError,
      invalidatesTags: (_result, error, { productId }) =>
        error ? [] : [sewingCompositionTag(productId)],
    }),
  }),
});
export const { useListSewingArticlesQuery, useCreateSewingArticleMutation } = sewingArticlesApi;
