import { record } from '../response-validation';
import {
  ensureSewingResponse,
  sewingResponseInteger,
  sewingResponseNullableText,
} from '../sewing-response-values';
import { validateSewingArticleResponse } from './validate-sewing-article-response';

import type { SewingArticleListDto } from '../../contracts/sewing-articles/sewing-article-list.dto';

export function validateSewingArticleListResponse(value: unknown): SewingArticleListDto {
  const item = record(value);
  ensureSewingResponse(
    sewingResponseInteger(item['productId'], 1) &&
      sewingResponseInteger(item['version']) &&
      sewingResponseNullableText(item['modelCode']) &&
      Array.isArray(item['articles']) &&
      item['articles'].length <= 200,
  );
  const articles = item['articles'].map(validateSewingArticleResponse);
  ensureSewingResponse(
    articles.every((a) => a.productId === item['productId']) &&
      new Set(articles.map((a) => a.id)).size === articles.length,
  );
  return { ...(item as unknown as SewingArticleListDto), articles };
}
