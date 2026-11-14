import {
  FABRIC_NORM_DECIMALS,
  FABRIC_NORM_MAX_METERS,
  fabricNormFields,
} from '../../entities/norms/fabric-norm';

import type { FabricNormField, FabricNormValues } from '../../entities/norms/fabric-norm';

/** Text of the six inputs; a comma works as the decimal point. */
export type FabricNormFormValues = Record<FabricNormField, string>;
export type FabricNormErrors = Partial<Record<FabricNormField | 'norm', string>>;

export function createFabricNormFormValues(norm: FabricNormValues | null): FabricNormFormValues {
  return Object.fromEntries(
    fabricNormFields.map((field) => [field, norm?.[field] == null ? '' : String(norm[field])]),
  ) as FabricNormFormValues;
}

export function parseMeters(value: string): number | null | undefined {
  const text = value.trim().replace(',', '.');
  if (!text) return null;
  if (!/^\d+(\.\d+)?$/.test(text)) return undefined;
  return Number(text);
}

const scale = 10 ** FABRIC_NORM_DECIMALS;

export function validateFabricNorm(values: FabricNormFormValues): FabricNormErrors {
  const errors: FabricNormErrors = {};
  const parsed = {} as Record<FabricNormField, number | null>;
  for (const field of fabricNormFields) {
    const meters = parseMeters(values[field]);
    if (
      meters === undefined ||
      (meters !== null &&
        (meters <= 0 ||
          meters > FABRIC_NORM_MAX_METERS ||
          Math.round(meters * scale) !== meters * scale))
    )
      errors[field] =
        `Метри від 0,001 до ${FABRIC_NORM_MAX_METERS}, не більше 3 знаків після коми.`;
    parsed[field] = meters ?? null;
  }
  if (parsed.twoColorsAdditional !== null && parsed.twoColorsMain === null)
    errors.twoColorsMain = 'Вкажіть основну тканину для двох кольорів.';
  if (
    (parsed.threeColorsAdditional1 !== null || parsed.threeColorsAdditional2 !== null) &&
    parsed.threeColorsMain === null
  )
    errors.threeColorsMain = 'Вкажіть основну тканину для трьох кольорів.';
  if (fabricNormFields.every((field) => parsed[field] === null))
    errors.norm = 'Вкажіть хоча б одне значення.';
  return errors;
}

export function fabricNormBody(values: FabricNormFormValues): FabricNormValues {
  return Object.fromEntries(
    fabricNormFields.map((field) => [field, parseMeters(values[field]) ?? null]),
  ) as unknown as FabricNormValues;
}

/** Sum of the parts while typing, like the server's totals. */
export function fabricNormTotal(values: FabricNormFormValues, fields: readonly FabricNormField[]) {
  const parts = fields.map((field) => parseMeters(values[field]));
  if (parts.some((part) => part === undefined) || parts.every((part) => part === null)) return null;
  return Math.round(parts.reduce<number>((sum, part) => sum + (part ?? 0), 0) * scale) / scale;
}
