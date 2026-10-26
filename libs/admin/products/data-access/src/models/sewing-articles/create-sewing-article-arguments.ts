import type { SewingArticleCreateDraft } from '@admin/products/model';

export interface CreateSewingArticleArguments {
  productId: number;
  draft: SewingArticleCreateDraft;
}
