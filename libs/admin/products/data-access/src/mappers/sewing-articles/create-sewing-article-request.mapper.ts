import type { SewingArticleCreateDraft } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

export function mapCreateSewingArticleRequest(
  draft: SewingArticleCreateDraft,
): operations['createSewingArticle']['requestBody']['content']['application/json'] {
  return {
    saleSku: draft.saleSku,
    active: draft.active,
    sortOrder: draft.sortOrder,
    expectedVersion: draft.expectedVersion,
  };
}
