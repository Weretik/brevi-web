/** Largest amount the backend accepts, in kopecks. */
export const maxMinor = 99_999_999_999_999;

const groupFormat = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Hryvnias as typed by people («62 546,40», «-1 200.5», «100») to kopecks. Spaces (also
 * non-breaking) group thousands; a comma or a dot separates at most two decimals. Returns null for
 * anything else.
 */
export function parseMoneyToMinor(text: string): number | null {
  const clean = text.replace(/[\s  ]/g, '').replace(/₴|грн\.?$/i, '');
  const match = /^(-?)(\d+)(?:[.,](\d{1,2}))?$/.exec(clean);
  if (!match) return null;
  const [, sign, whole, fraction = ''] = match;
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(minor) || minor > maxMinor) return null;
  return sign === '-' && minor !== 0 ? -minor : minor;
}

/** Kopecks as hryvnias for a form field: «62546,40» without grouping, so it parses back. */
export function minorToInput(minor: number): string {
  const sign = minor < 0 ? '-' : '';
  const value = Math.abs(minor);
  return `${sign}${Math.trunc(value / 100)},${String(value % 100).padStart(2, '0')}`;
}

/** Kopecks for reading: «62 546,40 ₴». */
export function formatMinor(minor: number, currency = 'UAH'): string {
  const text = groupFormat.format(minor / 100);
  return currency === 'UAH' ? `${text} ₴` : `${text} ${currency}`;
}

/** YYYY-MM-DD as «01.10.2026». */
export function formatLedgerDate(date: string): string {
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}.${month}.${year}` : date;
}

/** Signed operation amount: «+500,00 ₴» for an income, «−300,00 ₴» for an expense. */
export function formatSignedMinor(
  type: 'Income' | 'Expense',
  minor: number,
  currency = 'UAH',
): string {
  return `${type === 'Income' ? '+' : '−'}${formatMinor(minor, currency)}`;
}
