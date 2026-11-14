import type { TaskSchedule } from '../entities/scheduled-task';

export const weekdayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'] as const;

const pad = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

/** «Пн–Пт», «Щодня», «Сб, Нд» or «Пн, Ср, Пт»: three or more days in a row are a range. */
export function describeDays(days: readonly number[]): string {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  if (sorted.length === 7) return 'Щодня';
  const parts: string[] = [];
  for (let start = 0; start < sorted.length;) {
    let end = start;
    while (end + 1 < sorted.length && sorted[end + 1] === sorted[end] + 1) end++;
    const label = (day: number) => weekdayLabels[day - 1];
    if (end - start >= 2) parts.push(`${label(sorted[start])}–${label(sorted[end])}`);
    else for (let index = start; index <= end; index++) parts.push(label(sorted[index]));
    start = end + 1;
  }
  return parts.join(', ');
}

function describeInterval(minutes: number): string {
  if (minutes === 1) return 'Щохвилини';
  if (minutes === 60) return 'Щогодини';
  return minutes % 60 === 0 ? `Кожні ${minutes / 60} год` : `Кожні ${minutes} хв`;
}

/** The schedule in words: «Пн–Пт о 09:00», «Кожні 10 хв, 08:00–20:00», «Лише вручну». */
export function describeSchedule(schedule: TaskSchedule): string {
  if (schedule.kind === 'manual') return 'Лише вручну';
  if (schedule.kind === 'daily')
    return `${describeDays(schedule.days)} о ${[...schedule.times].sort().join(', ')}`;
  const every = describeInterval(schedule.everyMinutes ?? 0);
  return schedule.fromHour === null || schedule.toHour === null
    ? every
    : `${every}, ${pad(schedule.fromHour)}–${pad(schedule.toHour)}`;
}
