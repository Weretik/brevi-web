import { fromKyivInput } from '../mappers/kyiv-time';

import type {
  ScheduleKind,
  ScheduledTask,
  ScheduledTaskScheduleInput,
} from '../entities/scheduled-task';

/** «Змінити розклад» as the admin edits it: texts for number fields, Kyiv wall time for the next run. */
export interface ScheduleFormValues {
  enabled: boolean;
  kind: ScheduleKind;
  everyMinutes: string;
  fromHour: string;
  toHour: string;
  times: string[];
  days: number[];
  /** Empty: the next run follows the schedule. */
  nextRunAt: string;
}

export function scheduleFormOf(task: ScheduledTask): ScheduleFormValues {
  const { schedule } = task;
  return {
    enabled: task.enabled,
    kind: schedule.kind,
    everyMinutes: schedule.everyMinutes === null ? '60' : String(schedule.everyMinutes),
    fromHour: schedule.fromHour === null ? '' : String(schedule.fromHour),
    toHour: schedule.toHour === null ? '' : String(schedule.toHour),
    times: schedule.times.length > 0 ? [...schedule.times] : ['09:00'],
    days: schedule.days.length > 0 ? [...schedule.days] : [1, 2, 3, 4, 5],
    nextRunAt: '',
  };
}

const number = (value: string) => (value.trim() === '' ? null : Number(value));

/** The request of valid values; fields of other kinds are left out. */
export function scheduleInputOf(values: ScheduleFormValues): ScheduledTaskScheduleInput {
  const interval = values.kind === 'interval';
  const daily = values.kind === 'daily';
  return {
    enabled: values.enabled,
    schedule: {
      kind: values.kind,
      everyMinutes: interval ? number(values.everyMinutes) : null,
      fromHour: interval ? number(values.fromHour) : null,
      toHour: interval ? number(values.toHour) : null,
      times: daily ? [...new Set(values.times)].sort() : [],
      days: daily ? [...values.days].sort((a, b) => a - b) : [],
    },
    nextRunAt: values.nextRunAt ? fromKyivInput(values.nextRunAt) : null,
  };
}
