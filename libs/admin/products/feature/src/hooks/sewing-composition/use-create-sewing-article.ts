import { useCreateSewingArticleMutation } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SewingArticleCreateDraft } from '@admin/products/model';

export function useCreateSewingArticle(productId: number) {
  const [createArticle, state] = useCreateSewingArticleMutation();
  const [error, setError] = useState<string | null>(null);

  async function create(draft: SewingArticleCreateDraft) {
    setError(null);
    try {
      return await createArticle({ productId, draft }).unwrap();
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося створити артикул.'));
      return null;
    }
  }

  return { create, state, error };
}
