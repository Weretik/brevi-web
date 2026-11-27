/** The period of a client or supplier card: one choice for every tab (CARD-001). */
export type CardPeriod = 'all' | 'month' | 'quarter' | 'year' | 'custom';

export interface CardPeriodState {
  readonly period: CardPeriod;
  /** Kyiv days, `yyyy-mm-dd`, inclusive; undefined means open. */
  readonly from?: string;
  readonly to?: string;
}

export const cardPeriods: readonly CardPeriod[] = ['all', 'month', 'quarter', 'year', 'custom'];

export const cardPeriodLabels: Readonly<Record<CardPeriod, string>> = {
  all: 'Увесь час',
  month: 'Цей місяць',
  quarter: '3 місяці',
  year: 'Цей рік',
  custom: 'Свій період',
};

const day = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

const isDay = (value: string | null | undefined): value is string =>
  !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

/** The dates a preset covers on `today`; «Свій період» keeps the typed dates. */
export function cardPeriodRange(
  period: CardPeriod,
  today: Date,
  custom: { from?: string | null; to?: string | null } = {},
): CardPeriodState {
  const y = today.getFullYear();
  const m = today.getMonth();
  switch (period) {
    case 'month':
      return { period, from: day(new Date(y, m, 1)), to: day(today) };
    case 'quarter':
      return { period, from: day(new Date(y, m - 2, 1)), to: day(today) };
    case 'year':
      return { period, from: day(new Date(y, 0, 1)), to: day(today) };
    case 'custom':
      return {
        period,
        from: isDay(custom.from) ? custom.from : undefined,
        to: isDay(custom.to) ? custom.to : undefined,
      };
    default:
      return { period: 'all' };
  }
}

/** Reads `?period=&from=&to=` of the card; anything unknown is «Увесь час». */
export function readCardPeriod(params: URLSearchParams, today = new Date()): CardPeriodState {
  const raw = params.get('period');
  const period = cardPeriods.find((value) => value === raw) ?? 'all';
  return cardPeriodRange(period, today, { from: params.get('from'), to: params.get('to') });
}

/** Writes the period into the card's query, keeping the other keys (such as `tab`). */
export function writeCardPeriod(params: URLSearchParams, state: CardPeriodState): URLSearchParams {
  const next = new URLSearchParams(params);
  ['period', 'from', 'to'].forEach((key) => next.delete(key));
  if (state.period !== 'all') next.set('period', state.period);
  if (state.period === 'custom') {
    if (state.from) next.set('from', state.from);
    if (state.to) next.set('to', state.to);
  }
  return next;
}

const short = (value: string) => value.split('-').reverse().join('.');

/** «01.11.2026 – 27.11.2026» for a custom period, else the preset name. */
export function cardPeriodTitle(state: CardPeriodState): string {
  if (state.period !== 'custom' || (!state.from && !state.to))
    return cardPeriodLabels[state.period];
  return `${state.from ? short(state.from) : '…'} – ${state.to ? short(state.to) : '…'}`;
}
