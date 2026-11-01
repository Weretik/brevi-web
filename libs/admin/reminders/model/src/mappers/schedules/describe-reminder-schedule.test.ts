import { describe, expect, it } from 'vitest';

import { describeReminderSchedule } from './describe-reminder-schedule';

describe('describeReminderSchedule', () => {
  it.each([
    [
      { periodicity: 'monthly', dueRule: 'dayOfMonth', day: 20, monthOffset: 1, leadDays: 5 },
      'Щомісяця · до 20 числа наступного місяця',
    ],
    [
      {
        periodicity: 'monthly',
        dueRule: 'lastWorkingDayOfMonth',
        day: 0,
        monthOffset: 0,
        leadDays: 5,
      },
      'Щомісяця · останній робочий день цього місяця',
    ],
    [
      {
        periodicity: 'quarterly',
        dueRule: 'daysAfterPeriodEnd',
        day: 40,
        monthOffset: 0,
        leadDays: 5,
      },
      'Щокварталу · 40 дн. після кінця кварталу',
    ],
  ] as const)('describes %o', (schedule, text) => {
    expect(describeReminderSchedule(schedule)).toBe(text);
  });
});
