import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { sewingCompositionTag } from './sewing-composition.cache';
import { sewingCompositionError } from './sewing-composition.errors';
import { mapReplaceSewingCompositionRequest } from '../../mappers/sewing-composition/replace-sewing-composition-request.mapper';
import { mapSewingComposition } from '../../mappers/sewing-composition/sewing-composition.mapper';

import type { SewingCompositionQuery } from '../../models/sewing-composition/sewing-composition-query';
import type { SewingCompositionDraft, SewingCompositionView } from '@admin/products/model';

export const sewingCompositionApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingComposition: build.query<SewingCompositionView, SewingCompositionQuery>({
      queryFn: ({ productId, articleId }, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{productId}/composition', {
            params: { path: { productId }, query: articleId === null ? {} : { articleId } },
            signal,
          }),
          mapSewingComposition,
          sewingCompositionError,
        ),
      providesTags: (_result, _error, { productId }) => [sewingCompositionTag(productId)],
    }),
    replaceSewingComposition: build.mutation<SewingCompositionView, SewingCompositionDraft>({
      queryFn: (draft, { signal }) =>
        apiCall(
          apiClient.PUT('/api/v1/products/{productId}/composition', {
            params: { path: { productId: draft.productId } },
            body: mapReplaceSewingCompositionRequest(draft),
            signal,
          }),
          mapSewingComposition,
          sewingCompositionError,
        ),
      invalidatesTags: (_result, error, { productId }) =>
        error
          ? []
          : [
              sewingCompositionTag(productId),
              { type: 'Product', id: productId },
              { type: 'Product', id: 'LIST' },
            ],
    }),
  }),
});
export const { useGetSewingCompositionQuery, useReplaceSewingCompositionMutation } =
  sewingCompositionApi;
