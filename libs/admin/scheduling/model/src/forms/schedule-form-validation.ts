import { fromKyivInput } from '../mappers/kyiv-time';

import type { ScheduleFormValues } from './schedule-form';

export type ScheduleFormField = 'everyMinutes' | 'hours' | 'times' | 'days' | 'nextRunAt';
export type ScheduleFormErrors = Partial<Record<ScheduleFormField, string>>;

/** The same limits as the backend's validator (SCH-001 R-02), in Ukrainian. */
export const scheduleLimits = { minMinutes: 5, maxMinutes: 1440, maxTimes: 6 } as const;

const wholeIn = (value: string, min: number, max: number) =>
  /^\d+$/.test(value.trim()) && Number(value) >= min && Number(value) <= max;

function intervalErrors(values: ScheduleFormValues): ScheduleFormErrors {
  const errors: ScheduleFormErrors = {};
  const { minMinutes, maxMinutes } = scheduleLimits;
  if (!wholeIn(values.everyMinutes, minMinutes, maxMinutes))
    errors.everyMinutes = `Інтервал від ${minMinutes} до ${maxMinutes} хвилин.`;
  const from = values.fromHour.trim();
  const to = values.toHour.trim();
  if (from !== '' || to !== '') {
    const valid =
      wholeIn(from, 0, 23) && wholeIn(to, 0, 23) && Number(values.fromHour) < Number(values.toHour);
    if (!valid) errors.hours = 'Години роботи: «з» і «до» від 0 до 23, «з» менше за «до».';
  }
  return errors;
}

function dailyErrors(values: ScheduleFormValues): ScheduleFormErrors {
  const errors: ScheduleFormErrors = {};
  const times = values.times.filter((time) => time.trim() !== '');
  if (times.length === 0 || times.length > scheduleLimits.maxTimes)
    errors.times = `Вкажіть від 1 до ${scheduleLimits.maxTimes} часів запуску.`;
  else if (times.some((time) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)))
    errors.times = 'Час запуску у форматі ГГ:ХХ, наприклад 07:00.';
  else if (new Set(times).size !== times.length) errors.times = 'Часи запуску не повторюються.';
  if (values.days.length === 0) errors.days = 'Оберіть хоча б один день тижня.';
  return errors;
}

/** Field errors of the form; empty when it can be saved. `now` is the current instant. */
export function validateScheduleForm(values: ScheduleFormValues, now: Date): ScheduleFormErrors {
  const errors =
    values.kind === 'interval'
      ? intervalErrors(values)
      : values.kind === 'daily'
        ? dailyErrors(values)
        : {};
  if (values.nextRunAt) {
    const at = fromKyivInput(values.nextRunAt);
    if (!at) errors.nextRunAt = 'Вкажіть дату й час.';
    else if (Date.parse(at) <= now.getTime())
      errors.nextRunAt = 'Наступний запуск не може бути в минулому.';
  }
  return errors;
}
