import { validateSewingArticleResponse } from '../../validators/sewing-articles/validate-sewing-article-response';

import type { SewingArticle } from '@admin/products/model';

export function mapSewingArticle(value: unknown): SewingArticle {
  const dto = validateSewingArticleResponse(value);
  return {
    id: dto.id,
    productId: dto.productId,
    saleSku: dto.saleSku,
    active: dto.active,
    sortOrder: dto.sortOrder,
  };
}
