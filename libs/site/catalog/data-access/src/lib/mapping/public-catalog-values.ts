import type { CatalogPriceTiers, CatalogProductType } from '@site/catalog/model';

/** Checks of single values of a public catalog answer: a value of another shape throws. */
export const invalid = (what: string) => new Error(`Public catalog API: unexpected ${what}`);

export function record(value: unknown, what: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(what);
  return value as Record<string, unknown>;
}

export function list(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw invalid(what);
  return value;
}

export function text(value: unknown, what: string): string {
  if (typeof value !== 'string') throw invalid(what);
  return value;
}

export const optionalText = (value: unknown, what: string): string | null =>
  value === null || value === undefined ? null : text(value, what);

export function count(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) throw invalid(what);
  return value;
}

export function price(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw invalid(what);
  return value;
}

export const optionalPrice = (value: unknown, what: string): number | null =>
  value === null || value === undefined ? null : price(value, what);

export function productType(value: unknown): CatalogProductType {
  if (value !== 'Sewing' && value !== 'Ppe') throw invalid('product type');
  return value;
}

export function tiers(value: unknown): CatalogPriceTiers | null {
  if (value === null || value === undefined) return null;
  const prices = record(value, 'prices');
  return {
    retail: price(prices['retail'], 'retail price'),
    wholesale: price(prices['wholesale'], 'wholesale price'),
    largeWholesale: price(prices['largeWholesale'], 'large wholesale price'),
  };
}
