import { record } from '../response-validation';
import { ensureSewingResponse, sewingResponseInteger } from '../sewing-response-values';

import type { SewingArticleDto } from '../../contracts/sewing-articles/sewing-article.dto';

export function validateSewingArticleResponse(value: unknown): SewingArticleDto {
  const item = record(value);
  ensureSewingResponse(
    sewingResponseInteger(item['id'], 1) &&
      sewingResponseInteger(item['productId'], 1) &&
      typeof item['saleSku'] === 'string' &&
      item['saleSku'].trim().length > 0 &&
      item['saleSku'].length <= 80 &&
      typeof item['active'] === 'boolean' &&
      sewingResponseInteger(item['sortOrder']),
  );
  return item as unknown as SewingArticleDto;
}
