import type { EmbroideryCalculationValues } from '../forms/embroidery-calculation-form';

/** The server ceilings; they only stop typing mistakes. */
export const embroideryCalculationLimits = {
  quantity: 1_000_000,
  stitches: 1_000_000,
  layers: 20,
  perHoop: 500,
  minutes: 100_000,
} as const;

export type EmbroideryCalculationField =
  | 'quantity'
  | 'stitchesPerUnit'
  | 'hoopId'
  | 'unitsPerHoop'
  | 'stabilizerLayers'
  | 'fabricLayers'
  | 'programMinutes'
  | 'machineMinutes';

export type EmbroideryCalculationErrors = Partial<Record<EmbroideryCalculationField, string>>;

const whole = (value: number | null, min: number, max: number) =>
  value !== null && Number.isInteger(value) && value >= min && value <= max;

/**
 * Problems of a typed calculation. An empty quantity or stitch count is not a problem yet: the prices just
 * wait for them.
 */
export function validateEmbroideryCalculation(
  values: EmbroideryCalculationValues,
): EmbroideryCalculationErrors {
  const limits = embroideryCalculationLimits;
  const errors: EmbroideryCalculationErrors = {};
  if (values.quantity !== null && !whole(values.quantity, 1, limits.quantity))
    errors.quantity = 'Ціле число від 1.';
  if (values.stitchesPerUnit !== null && !whole(values.stitchesPerUnit, 1, limits.stitches))
    errors.stitchesPerUnit = 'Ціле число від 1.';
  if (!values.hoopId) errors.hoopId = 'Оберіть п’яльця.';
  if (!whole(values.stabilizerLayers, 1, limits.layers))
    errors.stabilizerLayers = `Від 1 до ${limits.layers}.`;
  if (values.mode === 'Chevron') {
    if (!whole(values.unitsPerHoop, 1, limits.perHoop))
      errors.unitsPerHoop = `Від 1 до ${limits.perHoop}.`;
    if (!whole(values.fabricLayers, 1, limits.layers))
      errors.fabricLayers = `Від 1 до ${limits.layers}.`;
  }
  if (values.program !== 'Ready' && !whole(values.programMinutes, 0, limits.minutes))
    errors.programMinutes = 'Вкажіть час розробки.';
  if (
    values.machineMinutes !== null &&
    !(values.machineMinutes >= 0 && values.machineMinutes <= limits.minutes)
  )
    errors.machineMinutes = 'Від 0 хвилин.';
  return errors;
}
