import { describe, expect, it } from 'vitest';

import { scheduleFormOf, scheduleInputOf } from './schedule-form';
import { validateScheduleForm } from './schedule-form-validation';

import type { ScheduledTask } from '../entities/scheduled-task';

const task: ScheduledTask = {
  key: 'leads',
  name: 'Ліди',
  description: 'Переносить ліди.',
  editable: true,
  enabled: false,
  schedule: {
    kind: 'daily',
    everyMinutes: null,
    fromHour: null,
    toHour: null,
    times: ['09:00'],
    days: [1, 2, 3, 4, 5],
  },
  nextRunAt: null,
  isRunning: false,
  runningSince: null,
  runRequestedAt: null,
  lastSuccessAt: null,
  lastSuccessSummary: null,
  lastFailureAt: null,
  lastFailureReason: null,
  lastRunFailed: false,
  overdue: false,
};
const now = new Date('2026-11-16T07:00:00Z');

describe('schedule form', () => {
  it('sends only the fields of the chosen kind, sorted', () => {
    const values = {
      ...scheduleFormOf(task),
      enabled: true,
      times: ['13:00', '07:00'],
      days: [5, 1],
    };

    expect(validateScheduleForm(values, now)).toEqual({});
    expect(scheduleInputOf(values)).toEqual({
      enabled: true,
      schedule: {
        kind: 'daily',
        everyMinutes: null,
        fromHour: null,
        toHour: null,
        times: ['07:00', '13:00'],
        days: [1, 5],
      },
      nextRunAt: null,
    });
    expect(
      scheduleInputOf({
        ...values,
        kind: 'interval',
        everyMinutes: '10',
        fromHour: '8',
        toHour: '20',
      }).schedule,
    ).toEqual({ kind: 'interval', everyMinutes: 10, fromHour: 8, toHour: 20, times: [], days: [] });
  });

  it('refuses what the backend would refuse, in Ukrainian', () => {
    const values = scheduleFormOf(task);

    expect(validateScheduleForm({ ...values, times: [] }, now).times).toMatch(/від 1 до 6/);
    expect(validateScheduleForm({ ...values, times: ['7'] }, now).times).toMatch(/ГГ:ХХ/);
    expect(validateScheduleForm({ ...values, days: [] }, now).days).toMatch(/день тижня/);
    const interval = { ...values, kind: 'interval' as const };
    expect(validateScheduleForm({ ...interval, everyMinutes: '2' }, now).everyMinutes).toMatch(
      /від 5/,
    );
    expect(
      validateScheduleForm({ ...interval, fromHour: '20', toHour: '8' }, now).hours,
    ).toBeDefined();
    expect(
      validateScheduleForm({ ...values, nextRunAt: '2026-11-16T08:00' }, now).nextRunAt,
    ).toMatch(/минулому/);
    expect(validateScheduleForm({ ...values, kind: 'manual', times: [] }, now)).toEqual({});
  });
});
