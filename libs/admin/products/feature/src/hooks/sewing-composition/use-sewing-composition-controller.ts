import { useCallback, useState } from 'react';

import { useCreateSewingArticle } from './use-create-sewing-article';
import { useSewingCompositionDrafts } from './use-sewing-composition-drafts';
import { useSewingCompositionQueries } from './use-sewing-composition-queries';
import { useSewingCompositionScope } from './use-sewing-composition-scope';
import { useSewingCompositionView } from './use-sewing-composition-view';
import { useSewingCompositionWrites } from './use-sewing-composition-writes';
import { useSewingNavigationProtection } from './use-sewing-navigation-protection';

import type { PendingSewingScopeSwitch } from '../../model/sewing-composition/pending-scope-switch';
import type { SewingCompositionScope } from '../../model/sewing-composition/sewing-composition-scope';
import type { SewingArticleCreateDraft } from '@admin/products/model';

export function useSewingCompositionController(
  productId: number,
  onDirtyChange?: (dirty: boolean) => void,
) {
  const [scope, setScope] = useState<SewingCompositionScope>('Model');
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const {
    access,
    fabrics,
    accessories,
    operations,
    articles,
    sharedComposition,
    selectedComposition,
  } = useSewingCompositionQueries(productId, scope, selectedArticleId);
  const canManage = access.data?.canManage === true;
  const sewingLookups = {
    fabrics: fabrics.data ?? [],
    accessories: accessories.data ?? [],
    operations: operations.data ?? [],
  };
  const drafts = useSewingCompositionDrafts(
    scope,
    selectedArticleId,
    sharedComposition.data,
    selectedComposition.data,
  );
  const {
    modelDraft,
    setModelDraft,
    modelBaseline,
    setModelBaseline,
    setArticleDrafts,
    setArticleBaselines,
    articleDraft,
    articleBaseline,
    currentDirty,
    dirty,
  } = drafts;
  const writes = useSewingCompositionWrites({
    modelDraft,
    setModelDraft: (draft) => setModelDraft(draft),
    setModelBaseline: (draft) => setModelBaseline(draft),
    articleDraft,
    selectedArticleId,
    setArticleDraft: (id, draft, baseline = false) => {
      setArticleDrafts((current) => ({ ...current, [id]: draft }));
      if (baseline) setArticleBaselines((current) => ({ ...current, [id]: draft }));
    },
    refetchCurrent: () =>
      scope === 'Model' ? sharedComposition.refetch() : selectedComposition.refetch(),
    replaceCurrentArticle: scope === 'Article',
  });
  const [pendingSwitch, setPendingSwitch] = useState<PendingSewingScopeSwitch | null>(null);

  const articleCreation = useCreateSewingArticle(productId);
  const busy = writes.busy || articleCreation.state.isLoading;
  const { setMutationError } = writes;
  const navigationBlocker = useSewingNavigationProtection(dirty, busy, onDirtyChange);
  const navigationBlocked = navigationBlocker.state === 'blocked';
  const view = useSewingCompositionView(scope, selectedArticleId, canManage, {
    access,
    canRead: access.data?.canRead === true,
    fabrics,
    accessories,
    operations,
    articles,
    sharedComposition,
    selectedComposition,
  });

  const discardCurrentDraft = useCallback(() => {
    if (scope === 'Model' && modelBaseline) setModelDraft(modelBaseline);
    if (scope === 'Article' && selectedArticleId !== null && articleBaseline) {
      setArticleDrafts((current) => ({ ...current, [selectedArticleId]: articleBaseline }));
    }
  }, [articleBaseline, modelBaseline, scope, selectedArticleId]);

  const createArticleNow = async (draft: SewingArticleCreateDraft) => {
    const created = await articleCreation.create(draft);
    if (created) {
      setSelectedArticleId(created.id);
      setScope('Article');
    }
  };

  const { requestModel, requestArticle, requestCreateArticle, confirmSwitch } =
    useSewingCompositionScope({
      scope,
      setScope,
      selectedArticleId,
      setSelectedArticleId,
      pendingSwitch,
      setPendingSwitch,
      dirty,
      currentDirty,
      busy,
      createArticle: createArticleNow,
      discardCurrentDraft,
      clearMutationError: () => setMutationError(null),
    });

  return {
    access,
    queries: { fabrics, accessories, operations, articles, sharedComposition, selectedComposition },
    selection: {
      scope,
      selectedArticleId,
      pendingSwitch,
      setPendingSwitch,
      requestModel,
      requestArticle,
      requestCreateArticle,
      confirmSwitch,
    },
    drafts,
    writes,
    articleCreation,
    canManage,
    sewingLookups,
    view,
    busy,
    navigation: { blocker: navigationBlocker, blocked: navigationBlocked, discardCurrentDraft },
  };
}
