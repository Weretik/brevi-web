const numberFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 4 });
const moneyLikeFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** The sheet keeps percentages as fractions; the unit «%» marks them. */
export function isPercentUnit(unit: string): boolean {
  return unit.trim() === '%';
}

/** 0.2174 → 21.74 without float noise. */
export function fractionToPercent(value: number): number {
  return Math.round(value * 100 * 1e6) / 1e6;
}

/** 21.74 → 0.2174 without float noise. */
export function percentToFraction(value: number): number {
  return Math.round((value / 100) * 1e8) / 1e8;
}

/** 0.45 → «45 %». */
export function formatPercent(fraction: number): string {
  return `${numberFormat.format(fractionToPercent(fraction))} %`;
}

/** A parameter value in the sheet's units: «25 %», «17 500 грн/міс.», «1,55 коеф.», «≈ 1,78 грн/хв». */
export function formatParameterValue(value: number | null, unit: string): string {
  if (value === null) return '—';
  if (isPercentUnit(unit)) return formatPercent(value);
  const formatted = (Math.abs(value) < 10 ? numberFormat : moneyLikeFormat).format(value);
  return unit.trim() ? `${formatted} ${unit.trim()}` : formatted;
}

/** «Прибуток — ЗІЗ: Рукавички» → «Прибуток — ЗІЗ»: subgroups share one filter chip. */
export function parameterSection(group: string): string {
  return group.split(':')[0]?.trim() || group;
}
