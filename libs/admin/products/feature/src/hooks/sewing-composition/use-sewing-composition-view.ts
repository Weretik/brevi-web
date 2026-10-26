import { sewingCompositionToDraft } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

import type { useSewingCompositionQueries } from './use-sewing-composition-queries';
import type { SewingCompositionScope } from '../../model/sewing-composition/sewing-composition-scope';

type Queries = ReturnType<typeof useSewingCompositionQueries>;

export function useSewingCompositionView(
  scope: SewingCompositionScope,
  selectedArticleId: number | null,
  canManage: boolean,
  queries: Queries,
) {
  const { articles, sharedComposition, selectedComposition, fabrics, accessories, operations } =
    queries;
  const articleById = useMemo(
    () => new Map((articles.data?.articles ?? []).map((article) => [article.id, article])),
    [articles.data?.articles],
  );
  const selectedArticle =
    selectedArticleId === null ? undefined : articleById.get(selectedArticleId);
  const selectedViewDraft =
    selectedComposition.data?.articleId === selectedArticleId
      ? sewingCompositionToDraft(selectedComposition.data)
      : null;
  const lookupError = fabrics.error ?? accessories.error ?? operations.error;
  const lookupsReady = Boolean(
    fabrics.data &&
    accessories.data &&
    operations.data &&
    !fabrics.isLoading &&
    !accessories.isLoading &&
    !operations.isLoading &&
    !lookupError,
  );
  const selectedView = selectedComposition.data;
  const articlesWithReadiness = (articles.data?.articles ?? []).map((article) => {
    const compositionMatches =
      article.id === selectedArticleId &&
      selectedView !== undefined &&
      selectedView.articleId === article.id &&
      selectedView.version === articles.data?.version;
    return compositionMatches
      ? {
          ...article,
          readiness: { ready: selectedView.blockers.length === 0, blockers: selectedView.blockers },
        }
      : article;
  });

  return {
    selectedArticle,
    selectedViewDraft,
    articlesWithReadiness,
    lookupError,
    lookupsReady,
    canManageComposition: canManage && lookupsReady,
    listError: articles.isError
      ? adminApiErrorMessage(articles.error, 'Не вдалося завантажити артикули.')
      : null,
    modelError: sharedComposition.isError
      ? adminApiErrorMessage(sharedComposition.error, 'Не вдалося завантажити спільний склад.')
      : null,
    selectedError: selectedComposition.isError
      ? adminApiErrorMessage(selectedComposition.error, 'Не вдалося завантажити склад артикулу.')
      : null,
    lookupErrorMessage: lookupError
      ? adminApiErrorMessage(
          lookupError,
          'Не вдалося завантажити довідники матеріалів та операцій.',
        )
      : null,
    loading:
      articles.isLoading ||
      sharedComposition.isLoading ||
      (scope === 'Article' && selectedArticleId !== null && selectedComposition.isLoading) ||
      fabrics.isLoading ||
      accessories.isLoading ||
      operations.isLoading,
  };
}
