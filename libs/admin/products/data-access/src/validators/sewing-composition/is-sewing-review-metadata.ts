import { sewingResponseNullableText } from '../sewing-response-values';

export function isSewingReviewMetadata(item: Record<string, unknown>): boolean {
  return (
    typeof item['reviewed'] === 'boolean' &&
    sewingResponseNullableText(item['reviewedBy']) &&
    sewingResponseNullableText(item['reviewedAt']) &&
    (!item['reviewed'] ||
      (typeof item['reviewedBy'] === 'string' &&
        !!item['reviewedBy'] &&
        typeof item['reviewedAt'] === 'string' &&
        Number.isFinite(Date.parse(item['reviewedAt']))))
  );
}
