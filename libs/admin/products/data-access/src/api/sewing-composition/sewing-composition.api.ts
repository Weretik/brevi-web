import { adminApi } from '@admin/shared/api-client';

import { sewingCompositionTag } from './sewing-composition.cache';
import { sewingCompositionError } from './sewing-composition.errors';
import { mapReplaceSewingArticleCompositionRequest } from '../../mappers/sewing-composition/replace-sewing-article-composition-request.mapper';
import { mapReplaceSewingCompositionRequest } from '../../mappers/sewing-composition/replace-sewing-composition-request.mapper';
import { mapSewingComposition } from '../../mappers/sewing-composition/sewing-composition.mapper';

import type { SewingCompositionQuery } from '../../models/sewing-composition/sewing-composition-query';
import type { SewingCompositionDraft, SewingCompositionView } from '@admin/products/model';

export const sewingCompositionApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingComposition: build.query<SewingCompositionView, SewingCompositionQuery>({
      query: ({ productId, articleId }) =>
        `/api/v1/products/${productId}/composition${articleId === null ? '' : `?articleId=${articleId}`}`,
      transformResponse: mapSewingComposition,
      transformErrorResponse: sewingCompositionError,
      providesTags: (_result, _error, { productId }) => [sewingCompositionTag(productId)],
    }),
    replaceSewingComposition: build.mutation<SewingCompositionView, SewingCompositionDraft>({
      query: (draft) => ({
        url: `/api/v1/products/${draft.productId}/composition`,
        method: 'PUT',
        body: mapReplaceSewingCompositionRequest(draft),
      }),
      transformResponse: mapSewingComposition,
      transformErrorResponse: sewingCompositionError,
      invalidatesTags: (_result, error, { productId }) =>
        error ? [] : [sewingCompositionTag(productId)],
    }),
    replaceSewingArticleComposition: build.mutation<SewingCompositionView, SewingCompositionDraft>({
      query: (draft) => ({
        url: `/api/v1/products/${draft.productId}/articles/${draft.articleId}/composition`,
        method: 'PUT',
        body: mapReplaceSewingArticleCompositionRequest(draft),
      }),
      transformResponse: mapSewingComposition,
      transformErrorResponse: sewingCompositionError,
      invalidatesTags: (_result, error, { productId }) =>
        error ? [] : [sewingCompositionTag(productId)],
    }),
  }),
});
export const {
  useGetSewingCompositionQuery,
  useReplaceSewingCompositionMutation,
  useReplaceSewingArticleCompositionMutation,
} = sewingCompositionApi;
