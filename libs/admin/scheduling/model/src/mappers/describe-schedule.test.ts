import { describe, expect, it } from 'vitest';

import { describeDays, describeSchedule } from './describe-schedule';

import type { TaskSchedule } from '../entities/scheduled-task';

const base: TaskSchedule = {
  kind: 'daily',
  everyMinutes: null,
  fromHour: null,
  toHour: null,
  times: [],
  days: [],
};

describe('describeSchedule', () => {
  it('names weekdays as a range, every day, or a list', () => {
    expect(describeDays([1, 2, 3, 4, 5])).toBe('Пн–Пт');
    expect(describeDays([1, 2, 3, 4, 5, 6, 7])).toBe('Щодня');
    expect(describeDays([6, 7])).toBe('Сб, Нд');
    expect(describeDays([5, 1, 3])).toBe('Пн, Ср, Пт');
    expect(describeDays([1, 2, 3, 6])).toBe('Пн–Ср, Сб');
  });

  it('describes daily, interval and manual schedules', () => {
    expect(
      describeSchedule({ ...base, times: ['13:00', '07:00'], days: [1, 2, 3, 4, 5, 6, 7] }),
    ).toBe('Щодня о 07:00, 13:00');
    expect(describeSchedule({ ...base, times: ['06:00'], days: [1] })).toBe('Пн о 06:00');
    expect(describeSchedule({ ...base, kind: 'interval', everyMinutes: 1 })).toBe('Щохвилини');
    expect(
      describeSchedule({ ...base, kind: 'interval', everyMinutes: 10, fromHour: 8, toHour: 20 }),
    ).toBe('Кожні 10 хв, 08:00–20:00');
    expect(describeSchedule({ ...base, kind: 'interval', everyMinutes: 120 })).toBe('Кожні 2 год');
    expect(describeSchedule({ ...base, kind: 'manual' })).toBe('Лише вручну');
  });
});
