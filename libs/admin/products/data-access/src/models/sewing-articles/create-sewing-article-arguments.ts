import type { SewingVariantInput } from '@admin/products/model';

export interface CreateSewingArticleArguments {
  productId: number;
  input: SewingVariantInput;
}

export interface UpdateSewingArticleArguments extends CreateSewingArticleArguments {
  articleId: number;
}

export interface DeleteSewingArticleArguments {
  productId: number;
  articleId: number;
  expectedVersion: number;
}
