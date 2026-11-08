const dayMs = 24 * 60 * 60 * 1000;
const dayFormat = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit' });
const timeFormat = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' });
const fullFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });
const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short' });

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Next contact as the queue shows it: «сьогодні 11:00», «завтра 10:00», «12.11 · 11:00», «05.11 · −3 дн». */
export function formatLeadNext(value: string, now: Date): string {
  const due = new Date(value);
  const days = Math.round((startOfDay(due).getTime() - startOfDay(now).getTime()) / dayMs);
  const time = timeFormat.format(due);
  if (days < 0) return `${dayFormat.format(due)} · −${-days} дн`;
  if (days === 0) return `сьогодні ${time}`;
  if (days === 1) return `завтра ${time}`;
  return `${dayFormat.format(due)} · ${time}`;
}

export const formatLeadMoment = (value: string): string => fullFormat.format(new Date(value));

/** `2026-08-19` → «19.08.2026». */
export const formatLeadDate = (value: string): string =>
  dateFormat.format(new Date(`${value}T00:00:00`));

/** `datetime-local` value for a date: local time, minutes. */
export function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Quick picks of «Коли передзвонити»: tomorrow 10:00, in 3 days 10:00, in a week 10:00. */
export function leadQuickDates(now: Date): readonly { label: string; value: string }[] {
  const at = (days: number) => {
    const date = startOfDay(now);
    date.setDate(date.getDate() + days);
    date.setHours(10, 0, 0, 0);
    return toLocalInput(date);
  };
  return [
    { label: 'Завтра', value: at(1) },
    { label: 'Через 3 дні', value: at(3) },
    { label: 'Через тиждень', value: at(7) },
  ];
}

export type LeadStatsPeriod = 'today' | 'week' | 'month' | 'all';

export const leadStatsPeriods: readonly { period: LeadStatsPeriod; label: string }[] = [
  { period: 'today', label: 'Сьогодні' },
  { period: 'week', label: 'Тиждень' },
  { period: 'month', label: 'Місяць' },
  { period: 'all', label: 'Увесь час' },
];

const isoDate = (date: Date) => toLocalInput(date).slice(0, 10);

/** Dates of «Зведення», both included; «Увесь час» is the ten years the server allows. */
export function leadStatsRange(period: LeadStatsPeriod, now: Date): { from: string; to: string } {
  const days = { today: 0, week: 6, month: 29, all: 3650 }[period];
  const from = startOfDay(now);
  from.setDate(from.getDate() - days);
  return { from: isoDate(from), to: isoDate(now) };
}
