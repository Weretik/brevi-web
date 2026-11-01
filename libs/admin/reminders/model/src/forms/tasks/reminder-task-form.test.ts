import { describe, expect, it } from 'vitest';

import {
  emptyReminderTaskForm,
  reminderFormToInput,
  reminderTaskToForm,
} from './reminder-task-form';

import type { ReminderTask } from '../../entities/tasks/reminder-task';

describe('reminder task form', () => {
  it('maps form values to the API input', () => {
    expect(
      reminderFormToInput({
        ...emptyReminderTaskForm,
        title: '  ЄСВ  ',
        dueRule: 'lastWorkingDayOfMonth',
        day: '20',
        monthOffset: '1',
      }),
    ).toEqual({
      title: 'ЄСВ',
      organization: 'ppBrevi',
      schedule: {
        periodicity: 'monthly',
        dueRule: 'lastWorkingDayOfMonth',
        day: 0,
        monthOffset: 1,
        leadDays: 5,
      },
      chatId: null,
      activeFrom: null,
      isEnabled: true,
    });
  });

  it('round-trips a saved task', () => {
    const task: ReminderTask = {
      id: 3,
      title: 'Декларація',
      organization: 'fopSohokon',
      schedule: {
        periodicity: 'quarterly',
        dueRule: 'daysAfterPeriodEnd',
        day: 40,
        monthOffset: 0,
        leadDays: 5,
      },
      chatId: 7,
      chatName: 'Бухгалтерія',
      activeFrom: '2026-11-01',
      isEnabled: false,
      nextDueDates: [],
    };
    expect(reminderFormToInput(reminderTaskToForm(task))).toEqual({
      title: 'Декларація',
      organization: 'fopSohokon',
      schedule: task.schedule,
      chatId: 7,
      activeFrom: '2026-11-01',
      isEnabled: false,
    });
  });
});
