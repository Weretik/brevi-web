const meters = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });

/** «1,25 м», or «—» when empty. */
export const formatMeters = (value: number | null) =>
  value === null ? '—' : `${meters.format(value)} м`;

export const formatProductionDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('uk-UA') : '—';

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
