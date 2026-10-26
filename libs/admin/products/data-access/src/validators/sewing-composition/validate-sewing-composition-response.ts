import { record } from '../response-validation';
import {
  ensureSewingResponse,
  sewingResponseInteger,
  sewingResponseNullableId,
  sewingResponseNullableText,
} from '../sewing-response-values';
import { validateSewingMaterialResponse } from './validate-sewing-material-response';
import { validateSewingOperationResponse } from './validate-sewing-operation-response';

import type { SewingCompositionDto } from '../../contracts/sewing-composition/sewing-composition.dto';

export function validateSewingCompositionResponse(value: unknown): SewingCompositionDto {
  const item = record(value);
  ensureSewingResponse(
    sewingResponseInteger(item['productId'], 1) &&
      sewingResponseNullableId(item['articleId']) &&
      sewingResponseNullableText(item['modelCode']) &&
      sewingResponseInteger(item['version']) &&
      Array.isArray(item['materials']) &&
      item['materials'].length <= 2000 &&
      Array.isArray(item['operations']) &&
      item['operations'].length <= 2000 &&
      Array.isArray(item['blockers']) &&
      item['blockers'].every((blocker) => typeof blocker === 'string'),
  );
  const materials = item['materials'].map((line) =>
    validateSewingMaterialResponse(line, item['articleId']),
  );
  const operations = item['operations'].map(validateSewingOperationResponse);
  ensureSewingResponse(
    new Set(materials.map((line) => line.id)).size === materials.length &&
      new Set(operations.map((line) => line.id)).size === operations.length,
  );
  return { ...(item as unknown as SewingCompositionDto), materials, operations };
}
