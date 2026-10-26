import { record } from '../response-validation';
import {
  ensureSewingResponse,
  sewingResponseInteger,
  sewingResponseNullableId,
  sewingResponsePositive,
} from '../sewing-response-values';
import { isSewingReviewMetadata } from './is-sewing-review-metadata';

import type { SewingMaterialDto } from '../../contracts/sewing-composition/sewing-material.dto';

export function validateSewingMaterialResponse(
  value: unknown,
  articleId: unknown,
): SewingMaterialDto {
  const line = record(value);
  ensureSewingResponse(
    sewingResponseInteger(line['id'], 1) &&
      sewingResponseNullableId(line['articleId']) &&
      ((line['scope'] === 'Model' && line['articleId'] === null) ||
        (line['scope'] === 'Article' && line['articleId'] === articleId && articleId !== null)) &&
      sewingResponsePositive(line['quantity']) &&
      sewingResponseInteger(line['sortOrder']) &&
      typeof line['required'] === 'boolean' &&
      isSewingReviewMetadata(line),
  );
  ensureSewingResponse(
    (line['kind'] === 'Fabric' &&
      sewingResponseInteger(line['referenceId'], 1) &&
      line['costCode'] === null &&
      line['unit'] === 'Metre') ||
      (line['kind'] === 'Accessory' &&
        sewingResponseInteger(line['referenceId'], 1) &&
        line['costCode'] === null &&
        line['unit'] === 'Piece') ||
      (line['kind'] === 'OtherCost' &&
        line['referenceId'] === null &&
        typeof line['costCode'] === 'string' &&
        !!line['costCode'].trim() &&
        line['unit'] === 'Service'),
  );
  return line as unknown as SewingMaterialDto;
}
