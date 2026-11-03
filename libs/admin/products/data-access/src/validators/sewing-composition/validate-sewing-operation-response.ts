import { record } from '../response-validation';
import {
  ensureSewingResponse,
  sewingResponseInteger,
  sewingResponsePositive,
} from '../sewing-response-values';
import { isSewingLineComment } from './is-sewing-line-comment';
import { isSewingReviewMetadata } from './is-sewing-review-metadata';

import type { SewingOperationDto } from '../../contracts/sewing-composition/sewing-operation.dto';

export function validateSewingOperationResponse(value: unknown): SewingOperationDto {
  const line = record(value);
  ensureSewingResponse(
    sewingResponseInteger(line['id'], 1) &&
      sewingResponseInteger(line['operationId'], 1) &&
      sewingResponsePositive(line['quantity']) &&
      (line['manualMinutes'] === null || sewingResponsePositive(line['manualMinutes'])) &&
      sewingResponseInteger(line['sortOrder']) &&
      isSewingReviewMetadata(line) &&
      isSewingLineComment(line['comment']),
  );
  return line as unknown as SewingOperationDto;
}
