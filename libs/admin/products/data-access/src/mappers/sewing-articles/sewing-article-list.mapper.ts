import { mapSewingArticle } from './sewing-article.mapper';
import { validateSewingArticleListResponse } from '../../validators/sewing-articles/validate-sewing-article-list-response';

import type { SewingArticleList } from '@admin/products/model';

export function mapSewingArticles(value: unknown): SewingArticleList {
  const dto = validateSewingArticleListResponse(value);
  return {
    productId: dto.productId,
    modelCode: dto.modelCode,
    version: dto.version,
    articles: dto.articles.map(mapSewingArticle),
  };
}
