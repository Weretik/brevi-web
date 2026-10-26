import { isSewingCompositionDirty, sewingCompositionToDraft } from '@admin/products/model';
import { useEffect, useState } from 'react';

import type {
  SewingCompositionDraft,
  SewingCompositionView,
  SewingMaterialDraft,
  SewingOperationDraft,
} from '@admin/products/model';

export function useSewingCompositionDrafts(
  scope: 'Model' | 'Article',
  selectedArticleId: number | null,
  sharedView: SewingCompositionView | undefined,
  selectedView: SewingCompositionView | undefined,
) {
  const [modelDraft, setModelDraft] = useState<SewingCompositionDraft | null>(null);
  const [modelBaseline, setModelBaseline] = useState<SewingCompositionDraft | null>(null);
  const [articleDrafts, setArticleDrafts] = useState<Record<number, SewingCompositionDraft>>({});
  const [articleBaselines, setArticleBaselines] = useState<Record<number, SewingCompositionDraft>>(
    {},
  );
  const modelDirty = Boolean(
    modelDraft && modelBaseline && isSewingCompositionDirty(modelDraft, modelBaseline),
  );
  const articleDraft =
    selectedArticleId === null ? null : (articleDrafts[selectedArticleId] ?? null);
  const articleBaseline =
    selectedArticleId === null ? null : (articleBaselines[selectedArticleId] ?? null);
  const articleDirty = Boolean(
    articleDraft && articleBaseline && isSewingCompositionDirty(articleDraft, articleBaseline),
  );

  useEffect(() => {
    if (
      !sharedView ||
      modelDirty ||
      (modelBaseline !== null && sharedView.version <= modelBaseline.version)
    )
      return;
    const draft = sewingCompositionToDraft(sharedView);
    setModelDraft(draft);
    setModelBaseline(draft);
  }, [modelBaseline, modelDirty, sharedView]);

  useEffect(() => {
    if (
      !selectedView ||
      selectedArticleId === null ||
      selectedView.articleId !== selectedArticleId ||
      articleDirty ||
      (articleBaselines[selectedArticleId] !== undefined &&
        selectedView.version <= articleBaselines[selectedArticleId].version)
    )
      return;
    const draft = sewingCompositionToDraft(selectedView);
    setArticleDrafts((current) => ({ ...current, [selectedArticleId]: draft }));
    setArticleBaselines((current) => ({ ...current, [selectedArticleId]: draft }));
  }, [articleBaselines, articleDirty, selectedArticleId, selectedView]);

  const updateModelMaterials = (materials: SewingMaterialDraft[]) =>
    setModelDraft((current) => (current ? { ...current, modelMaterials: materials } : current));
  const updateModelOperations = (operations: SewingOperationDraft[]) =>
    setModelDraft((current) => (current ? { ...current, operations } : current));
  const updateArticleMaterials = (materials: SewingMaterialDraft[]) => {
    if (selectedArticleId === null) return;
    setArticleDrafts((current) => {
      const draft = current[selectedArticleId];
      return draft
        ? { ...current, [selectedArticleId]: { ...draft, articleMaterials: materials } }
        : current;
    });
  };

  return {
    modelDraft,
    setModelDraft,
    modelBaseline,
    setModelBaseline,
    modelDirty,
    articleDrafts,
    setArticleDrafts,
    articleBaselines,
    setArticleBaselines,
    articleDraft,
    articleBaseline,
    articleDirty,
    currentDirty: scope === 'Model' ? modelDirty : articleDirty,
    dirty: modelDirty || articleDirty,
    updateModelMaterials,
    updateModelOperations,
    updateArticleMaterials,
  };
}
