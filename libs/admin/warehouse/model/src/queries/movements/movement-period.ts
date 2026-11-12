/** Every period preset of «Склад тканин»: «Рух тканини» and «Звіти» each show their own list. */
export type MovementPeriod =
  'all' | 'today' | 'week' | 'month' | 'lastMonth' | 'quarter' | 'custom';

/** The period chip of «Рух тканини». */
export const movementPeriods: readonly MovementPeriod[] = [
  'all',
  'today',
  'week',
  'month',
  'lastMonth',
  'custom',
];

/** «План і факт»: by the day of the last issue. */
export const planFactPeriods: readonly MovementPeriod[] = [
  'all',
  'month',
  'lastMonth',
  'quarter',
  'custom',
];

/** «Витрата за період»: always a period. */
export const consumptionPeriods: readonly MovementPeriod[] = [
  'week',
  'month',
  'lastMonth',
  'quarter',
  'custom',
];

export const movementPeriodLabels: Record<MovementPeriod, string> = {
  all: 'Усі дати',
  today: 'Сьогодні',
  week: 'Цей тиждень',
  month: 'Цей місяць',
  lastMonth: 'Минулий місяць',
  quarter: 'Цей квартал',
  custom: 'Свій період',
};

const iso = (date: Date) => date.toISOString().slice(0, 10);
const utc = (day: string) => new Date(`${day}T00:00:00Z`);

/**
 * The dates of a preset for `today` (`YYYY-MM-DD`, Kyiv): the week starts on Monday; «Свій період» keeps the
 * dates the person typed, so it gives none.
 */
export function movementPeriodRange(
  period: MovementPeriod,
  today: string,
): { from: string | null; to: string | null } {
  const day = utc(today);
  switch (period) {
    case 'today':
      return { from: today, to: today };
    case 'week': {
      const monday = new Date(day);
      monday.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));
      return { from: iso(monday), to: today };
    }
    case 'month':
      return { from: `${today.slice(0, 8)}01`, to: today };
    case 'quarter': {
      const first = new Date(
        Date.UTC(day.getUTCFullYear(), day.getUTCMonth() - (day.getUTCMonth() % 3), 1),
      );
      return { from: iso(first), to: today };
    }
    case 'lastMonth': {
      const first = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() - 1, 1));
      const last = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 0));
      return { from: iso(first), to: iso(last) };
    }
    default:
      return { from: null, to: null };
  }
}
