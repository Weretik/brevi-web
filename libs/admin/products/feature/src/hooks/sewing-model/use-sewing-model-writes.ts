import {
  useCreateSewingArticleMutation,
  useDeleteSewingArticleMutation,
  useReplaceSewingCompositionMutation,
  useUpdateSewingArticleMutation,
} from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SewingModel } from './use-sewing-model';
import type {
  SewingMaterialDraft,
  SewingOperationDraft,
  SewingVariantInput,
} from '@admin/products/model';

/**
 * Writes of the sewing card. Every change is saved at once and the prices are recalculated by
 * the server, so there are no drafts to keep. `modelCode` is the code from «Товари», so saving the
 * composition never restores an old code.
 */
export function useSewingModelWrites(
  productId: number,
  model: SewingModel,
  modelCode: string | null,
) {
  const [createVariant, createState] = useCreateSewingArticleMutation();
  const [updateVariant, updateState] = useUpdateSewingArticleMutation();
  const [deleteVariant, deleteState] = useDeleteSewingArticleMutation();
  const [replaceComposition, replaceState] = useReplaceSewingCompositionMutation();
  const [error, setError] = useState<string | null>(null);
  const busy =
    createState.isLoading ||
    updateState.isLoading ||
    deleteState.isLoading ||
    replaceState.isLoading;

  async function run(action: () => Promise<unknown>, fallback: string) {
    setError(null);
    try {
      await action();
      return true;
    } catch (cause) {
      setError(adminApiErrorMessage(cause, fallback));
      return false;
    }
  }

  const saveComposition = (
    change: { modelMaterials?: SewingMaterialDraft[]; operations?: SewingOperationDraft[] },
    fallback: string,
  ) => {
    const draft = model.draft;
    if (!draft) return Promise.resolve(false);
    return run(() => replaceComposition({ ...draft, modelCode, ...change }).unwrap(), fallback);
  };

  return {
    busy,
    error,
    clearError: () => setError(null),
    saveVariant: (articleId: number | null, input: SewingVariantInput) =>
      run(
        () =>
          articleId === null
            ? createVariant({ productId, input }).unwrap()
            : updateVariant({ productId, articleId, input }).unwrap(),
        'Не вдалося зберегти тканину.',
      ),
    deleteVariant: (articleId: number) =>
      run(
        () => deleteVariant({ productId, articleId, expectedVersion: model.version }).unwrap(),
        'Не вдалося видалити тканину.',
      ),
    saveMaterials: (materials: SewingMaterialDraft[]) =>
      saveComposition(
        { modelMaterials: materials.map((line, sortOrder) => ({ ...line, sortOrder })) },
        'Не вдалося зберегти комплектацію.',
      ),
    saveOperations: (operations: SewingOperationDraft[]) =>
      saveComposition(
        { operations: operations.map((line, sortOrder) => ({ ...line, sortOrder })) },
        'Не вдалося зберегти трудовитрати.',
      ),
  };
}

export type SewingModelWrites = ReturnType<typeof useSewingModelWrites>;
