import type { SewingArticle } from '../../entities/sewing-articles/sewing-article';
import type { SewingVariantInput } from '../../entities/sewing-articles/sewing-variant-input';

/** Side panel «Тканина» of a sewing model: the variant's fabric, metres, sale SKU and activity. */
export interface SewingVariantFormValues {
  fabricId: number | null;
  fabricQuantity: string;
  saleSku: string;
  active: boolean;
}

export type SewingVariantField = keyof SewingVariantFormValues;
export type SewingVariantFieldErrors = Partial<Record<SewingVariantField, string>>;

const metres = (value: number | null) => (value === null ? '' : String(value).replace('.', ','));

/**
 * Values of the panel. A new variant takes the metres of the model's other variants: in the
 * client's sheet both fabrics of a model use the same amount.
 */
export function createSewingVariantFormValues(
  variant: SewingArticle | null,
  siblings: readonly SewingArticle[],
): SewingVariantFormValues {
  if (variant)
    return {
      fabricId: variant.fabricId,
      fabricQuantity: metres(variant.fabricQuantity),
      saleSku: variant.saleSku,
      active: variant.active,
    };
  const known = siblings.find((item) => item.fabricQuantity !== null)?.fabricQuantity ?? null;
  return { fabricId: null, fabricQuantity: metres(known), saleSku: '', active: true };
}

export function parseSewingMetres(value: string): number {
  const text = value.trim().replace(',', '.');
  return text === '' ? Number.NaN : Number(text);
}

export function sewingVariantInput(
  values: SewingVariantFormValues,
  sortOrder: number,
  expectedVersion: number,
): SewingVariantInput {
  return {
    saleSku: values.saleSku.trim(),
    active: values.active,
    sortOrder,
    fabricId: values.fabricId ?? 0,
    fabricQuantity: parseSewingMetres(values.fabricQuantity),
    expectedVersion,
  };
}
