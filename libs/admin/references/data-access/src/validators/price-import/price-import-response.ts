import type {
  PriceImportResponse,
  PriceSourcesResponse,
} from '../../contracts/price-import/price-import-response';

type Row = Record<string, unknown>;

const isRecord = (value: unknown): value is Row => Boolean(value) && typeof value === 'object';
const isCount = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;
const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);
const isNullableNumber = (value: unknown) => value === null || isNumber(value);
const isNullableText = (value: unknown) => value === null || typeof value === 'string';

function isRun(value: unknown): boolean {
  if (value === null) return true;
  return (
    isRecord(value) &&
    typeof value['trigger'] === 'string' &&
    typeof value['actor'] === 'string' &&
    typeof value['finishedAt'] === 'string' &&
    ['checked', 'changed', 'unchanged', 'skipped'].every((key) => isCount(value[key])) &&
    Array.isArray(value['problems']) &&
    value['problems'].every(
      (problem) => isRecord(problem) && typeof problem['message'] === 'string',
    )
  );
}

export function parsePriceSourcesResponse(value: unknown): PriceSourcesResponse {
  const message = 'Некоректна відповідь списку «Імпорт цін».';
  if (
    !isRecord(value) ||
    typeof value['canChangeDiscounts'] !== 'boolean' ||
    !Array.isArray(value['sources'])
  )
    throw new Error(message);
  for (const row of value['sources']) {
    if (
      !isRecord(row) ||
      typeof row['key'] !== 'string' ||
      typeof row['title'] !== 'string' ||
      typeof row['method'] !== 'string' ||
      typeof row['schedule'] !== 'string' ||
      typeof row['logic'] !== 'string' ||
      !isNumber(row['discountPercent']) ||
      !isNumber(row['defaultDiscountPercent']) ||
      !isNullableNumber(row['supplierId']) ||
      !isNullableText(row['supplierName']) ||
      !isCount(row['productCount']) ||
      !isCount(row['manualPriceCount']) ||
      typeof row['fileKind'] !== 'string' ||
      !isCount(row['fileCount']) ||
      typeof row['automaticUpdateConnected'] !== 'boolean' ||
      !isRun(row['lastRun'])
    )
      throw new Error(message);
  }
  return value as PriceSourcesResponse;
}

export function parsePriceImportResponse(value: unknown): PriceImportResponse {
  const message = 'Некоректна відповідь імпорту цін.';
  if (
    !isRecord(value) ||
    typeof value['applied'] !== 'boolean' ||
    !isNumber(value['discountPercent']) ||
    !['checked', 'changed', 'unchanged', 'skipped'].every((key) => isCount(value[key])) ||
    !Array.isArray(value['rows'])
  )
    throw new Error(message);
  for (const row of value['rows']) {
    if (
      !isRecord(row) ||
      !Number.isInteger(row['productId']) ||
      typeof row['name'] !== 'string' ||
      typeof row['status'] !== 'string' ||
      !['oldPrice', 'newPrice', 'oldWholesale', 'newWholesale', 'oldRetail', 'newRetail'].every(
        (key) => isNullableNumber(row[key]),
      )
    )
      throw new Error(message);
  }
  return value as PriceImportResponse;
}
