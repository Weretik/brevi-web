import type { PendingSewingScopeSwitch } from '../../model/sewing-composition/pending-scope-switch';
import type { SewingCompositionScope } from '../../model/sewing-composition/sewing-composition-scope';
import type { SewingArticleCreateDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  scope: SewingCompositionScope;
  setScope: Dispatch<SetStateAction<SewingCompositionScope>>;
  selectedArticleId: number | null;
  setSelectedArticleId: Dispatch<SetStateAction<number | null>>;
  pendingSwitch: PendingSewingScopeSwitch | null;
  setPendingSwitch: Dispatch<SetStateAction<PendingSewingScopeSwitch | null>>;
  dirty: boolean;
  currentDirty: boolean;
  busy: boolean;
  createArticle: (draft: SewingArticleCreateDraft) => Promise<unknown>;
  discardCurrentDraft: () => void;
  clearMutationError: () => void;
}

export function useSewingCompositionScope({
  scope,
  setScope,
  selectedArticleId,
  setSelectedArticleId,
  pendingSwitch,
  setPendingSwitch,
  dirty,
  currentDirty,
  busy,
  createArticle,
  discardCurrentDraft,
  clearMutationError,
}: Props) {
  function requestModel() {
    if (busy || scope === 'Model') return;
    if (currentDirty) setPendingSwitch({ scope: 'Model' });
    else {
      setScope('Model');
      clearMutationError();
    }
  }

  function requestArticle(articleId: number) {
    if (busy || (scope === 'Article' && selectedArticleId === articleId)) return;
    if (currentDirty) setPendingSwitch({ scope: 'Article', articleId });
    else {
      setSelectedArticleId(articleId);
      setScope('Article');
      clearMutationError();
    }
  }

  function requestCreateArticle(draft: SewingArticleCreateDraft) {
    if (busy) return;
    if (dirty) setPendingSwitch({ scope: 'CreateArticle', draft });
    else void createArticle(draft);
  }

  function confirmSwitch() {
    const pending = pendingSwitch;
    if (!pending) return;
    discardCurrentDraft();
    setPendingSwitch(null);
    clearMutationError();
    if (pending.scope === 'Model') setScope('Model');
    else if (pending.scope === 'Article') {
      setSelectedArticleId(pending.articleId);
      setScope('Article');
    } else void createArticle(pending.draft);
  }

  return { requestModel, requestArticle, requestCreateArticle, confirmSwitch };
}
