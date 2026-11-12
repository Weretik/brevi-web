const meters = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** «1 234,5 м», or «—» when empty. */
export const formatMeters = (value: number | null) =>
  value === null ? '—' : `${meters.format(value)} м`;

/** «1 234,5» for a column whose title says «м». */
export const formatMetersNumber = (value: number) => meters.format(value);

const perProduct = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
});

/** Metres per product to thousandths: «2,167 м». */
export const formatPerProduct = (value: number | null) =>
  value === null ? '—' : `${perProduct.format(value)} м`;

/** A quantity to 6 decimals without a unit: «12,5». */
export const formatQuantity = (value: number) =>
  value.toLocaleString('uk-UA', { maximumFractionDigits: 6 });

const money = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** «343,25 грн», or «—» when empty. */
export const formatMoney = (value: number | null) =>
  value === null ? '—' : `${money.format(value)} грн`;

/** A calendar day «2026-11-19» as «19.11.2026» without a time zone shift. */
export function formatDay(value: string | null) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return day && month && year ? `${day}.${month}.${year}` : value;
}

const kyivTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** A moment as Kyiv time «19.11.2026, 14:05». */
export const formatKyivTime = (value: string | Date) => kyivTime.format(new Date(value));

const kyivDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Kyiv',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Today in Kyiv as yyyy-mm-dd: the default operation date of every stock form. */
export const kyivToday = (now = new Date()) => kyivDay.format(now);

/** Metres for a form field: «12,5». */
export const metersInput = (value: number) => String(value).replace('.', ',');
