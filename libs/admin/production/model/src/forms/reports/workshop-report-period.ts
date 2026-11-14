import { WORKSHOP_REPORT_MAX_MONTHS } from '../../entities/reports/workshop-report';

const MONTH = /^(\d{4})-(\d{2})$/;

const parse = (month: string): number | null => {
  const match = MONTH.exec(month);
  if (!match) return null;
  const value = Number(match[2]);
  return value >= 1 && value <= 12 ? Number(match[1]) * 12 + value - 1 : null;
};

const format = (index: number) =>
  `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;

/** The number of months from..to inclusive, or null when a month is not «РРРР-ММ». */
export function reportMonthCount(from: string, to: string): number | null {
  const first = parse(from);
  const last = parse(to);
  return first === null || last === null ? null : last - first + 1;
}

/** Why the period cannot be asked for, or null when it is fine (PRD-D48). */
export function reportPeriodProblem(from: string, to: string, currentMonth: string): string | null {
  const count = reportMonthCount(from, to);
  if (count === null) return 'Вкажіть місяці.';
  if (count < 1) return 'Початок періоду не може бути пізніше кінця.';
  if (count > WORKSHOP_REPORT_MAX_MONTHS) return 'Період звіту — не більше 12 місяців.';
  if (to > currentMonth) return 'Місяць ще не почався.';
  return null;
}

/** The same number of months right before the period: the default to compare with. */
export function previousReportPeriod(
  from: string,
  to: string,
): { from: string; to: string } | null {
  const first = parse(from);
  const count = reportMonthCount(from, to);
  if (first === null || count === null || count < 1) return null;
  return { from: format(first - count), to: format(first - 1) };
}

/** «Листопад 2026» or «Жовтень – листопад 2026». */
export function reportPeriodLabel(from: string, to: string): string {
  const name = (month: string) =>
    new Date(`${month}-01T00:00:00`)
      .toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
      .replace(' р.', '');
  if (from === to) return capitalize(name(from));
  return `${capitalize(name(from))} – ${name(to)}`;
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
