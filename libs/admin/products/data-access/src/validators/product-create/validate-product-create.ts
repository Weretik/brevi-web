import { ensurePricing, pricingId, validPricingTiers } from '../pricing/pricing-values';
import { record } from '../response-validation';

import type {
  CreatedCatalogProductDto,
  PpePricePreviewDto,
  ProductCodeCheckDto,
} from '../../contracts/product-create/product-create.dto';

const text = (value: unknown) => value === null || typeof value === 'string';
const type = (value: unknown) => value === 'Sewing' || value === 'Ppe';

function ensureProductCreate(valid: boolean): asserts valid {
  if (!valid) throw new Error('Некоректна відповідь сервера про створення товару.');
}

export function validateCreatedCatalogProduct(value: unknown): CreatedCatalogProductDto {
  const row = record(value);
  ensureProductCreate(
    pricingId(row['id']) &&
      type(row['type']) &&
      text(row['code']) &&
      typeof row['priceSaved'] === 'boolean',
  );
  return value as CreatedCatalogProductDto;
}

export function validateProductCodeCheck(value: unknown): ProductCodeCheckDto {
  const row = record(value);
  ensureProductCreate(
    text(row['code']) &&
      (row['isAvailable'] === null || typeof row['isAvailable'] === 'boolean') &&
      (row['takenByProductId'] === null || pricingId(row['takenByProductId'])) &&
      text(row['takenByProductName']) &&
      text(row['suggestedCode']),
  );
  return value as ProductCodeCheckDto;
}

export function validatePpePricePreview(value: unknown): PpePricePreviewDto {
  const row = record(value);
  const blockers = row['blockers'];
  ensurePricing(
    Array.isArray(blockers) &&
      blockers.every((item: unknown) => typeof record(item)['code'] === 'string'),
  );
  ensurePricing(
    row['isCalculated'] === true
      ? validPricingTiers(row['prices']) && (blockers as unknown[]).length === 0
      : row['isCalculated'] === false &&
          row['prices'] === null &&
          (blockers as unknown[]).length > 0,
  );
  return value as PpePricePreviewDto;
}
