const meters = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });
const number = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 4 });

/** «1,25 м», or «—» when empty. */
export const formatMeters = (value: number | null) =>
  value === null ? '—' : `${meters.format(value)} м`;

/** A pricing parameter value with its unit; «%» values are kept as the sheet shows them. */
export function formatParameterValue(value: number | null, unit: string | null) {
  if (value === null) return '—';
  return unit ? `${number.format(value)} ${unit}` : number.format(value);
}

export const formatProductionDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('uk-UA') : '—';
