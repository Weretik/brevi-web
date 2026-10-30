import { suggestionProductTypes } from '@admin/clients/model';

import {
  quoteArray,
  quoteFlag,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type {
  CustomSuggestionNorm,
  CustomSuggestionProductType,
  CustomSuggestions,
} from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Response =
  operations['getCrmSewingSuggestions']['responses'][200]['content']['application/json'];
function quantity(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value <= 0 ||
    value > 100000 ||
    !/^\d+(?:\.\d{1,6})?$/.test(String(value))
  )
    throw new Error('Некоректна норма підказки.');
  return value;
}
function mapNorm(value: unknown, sampleSize: number): CustomSuggestionNorm {
  const row = quoteRecord(value);
  const kind = row['kind'];
  if (kind !== 'accessory' && kind !== 'operation') throw new Error('Невідомий тип підказки.');
  const unit = quoteText(row['unit']);
  const sample = quoteInteger(row['sampleSize']);
  const minimumQuantity = quantity(row['minimumQuantity']);
  const maximumQuantity = quantity(row['maximumQuantity']);
  const norm = quantity(row['quantity']);
  if (
    !unit.trim() ||
    unit.length > 50 ||
    sample > sampleSize ||
    minimumQuantity > norm ||
    maximumQuantity < norm
  )
    throw new Error('Некоректна вибірка підказки.');
  return {
    kind,
    referenceId: quoteInteger(row['referenceId']),
    unit,
    manualMinutes: row['manualMinutes'] === null ? null : quantity(row['manualMinutes']),
    sampleSize: sample,
    minimumQuantity,
    maximumQuantity,
    quantity: norm,
    varyingNorm: quoteFlag(row['varyingNorm']),
  };
}
export function mapCustomSuggestions(value: unknown): CustomSuggestions {
  const row = quoteRecord(value);
  const productType = quoteText(row['productType']);
  const season = row['season'];
  if (
    !suggestionProductTypes.some((type) => type === productType) ||
    (season !== 'summer' && season !== 'winter')
  )
    throw new Error('Некоректний профіль підказок.');
  const sampleSize = quoteInteger(row['sampleSize'], 0);
  const sourceLimitReached = quoteFlag(row['sourceLimitReached']);
  const norms = quoteArray(row['norms'], 200).map((norm) => mapNorm(norm, sampleSize));
  if ((sourceLimitReached || sampleSize < 2) && norms.length)
    throw new Error('Неповна вибірка підказок.');
  const response = {
    productType: productType as CustomSuggestionProductType,
    season,
    sampleSize,
    sourceLimitReached,
    norms,
  } satisfies Response;
  return response;
}
