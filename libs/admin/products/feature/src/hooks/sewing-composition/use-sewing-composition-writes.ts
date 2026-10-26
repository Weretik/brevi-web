import {
  useReplaceSewingArticleCompositionMutation,
  useReplaceSewingCompositionMutation,
} from '@admin/products/data-access';
import { sewingCompositionToDraft } from '@admin/products/model';
import { useState } from 'react';

import { compositionMutationError } from '../../model/sewing-composition/composition-mutation-error';

import type { SewingCompositionDraft, SewingCompositionView } from '@admin/products/model';

interface Props {
  modelDraft: SewingCompositionDraft | null;
  setModelDraft: (draft: SewingCompositionDraft) => void;
  setModelBaseline: (draft: SewingCompositionDraft) => void;
  articleDraft: SewingCompositionDraft | null;
  selectedArticleId: number | null;
  setArticleDraft: (articleId: number, draft: SewingCompositionDraft, baseline?: boolean) => void;
  refetchCurrent: () => Promise<{ isSuccess: boolean; data?: SewingCompositionView }>;
  replaceCurrentArticle: boolean;
}

export function useSewingCompositionWrites({
  modelDraft,
  setModelDraft,
  setModelBaseline,
  articleDraft,
  selectedArticleId,
  setArticleDraft,
  refetchCurrent,
  replaceCurrentArticle,
}: Props) {
  const [replaceModel, replaceModelState] = useReplaceSewingCompositionMutation();
  const [replaceArticle, replaceArticleState] = useReplaceSewingArticleCompositionMutation();
  const [mutationError, setMutationError] = useState<ReturnType<
    typeof compositionMutationError
  > | null>(null);
  const [reloadError, setReloadError] = useState<string | null>(null);
  const busy = replaceModelState.isLoading || replaceArticleState.isLoading;

  async function saveModel() {
    if (!modelDraft) return;
    setMutationError(null);
    setReloadError(null);
    try {
      const updated = sewingCompositionToDraft(await replaceModel(modelDraft).unwrap());
      setModelDraft(updated);
      setModelBaseline(updated);
    } catch (cause) {
      setMutationError(compositionMutationError(cause, 'Model'));
    }
  }

  async function saveArticle() {
    if (!articleDraft || selectedArticleId === null) return;
    setMutationError(null);
    setReloadError(null);
    try {
      const updated = sewingCompositionToDraft(await replaceArticle(articleDraft).unwrap());
      setArticleDraft(selectedArticleId, updated, true);
    } catch (cause) {
      setMutationError(compositionMutationError(cause, 'Article'));
    }
  }

  async function reloadCurrent() {
    setReloadError(null);
    const result = await refetchCurrent();
    if (!result.isSuccess || !result.data) {
      setReloadError('Не вдалося завантажити актуальний склад. Чернетку збережено.');
      return;
    }
    const updated = sewingCompositionToDraft(result.data);
    if (replaceCurrentArticle && selectedArticleId !== null) {
      setArticleDraft(selectedArticleId, updated, true);
    } else {
      setModelDraft(updated);
      setModelBaseline(updated);
    }
    setMutationError(null);
  }

  return {
    busy,
    mutationError,
    setMutationError,
    reloadError,
    saveModel,
    saveArticle,
    reloadCurrent,
  };
}
