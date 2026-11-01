import { describe, expect, it } from 'vitest';

import { mapReminderTask } from './reminder-task.mapper';
import { taskResponse } from '../../testing/reminder-fixtures';

describe('mapReminderTask', () => {
  it('maps a backend task', () => {
    expect(mapReminderTask(taskResponse)).toEqual({
      id: 14,
      title: 'Декларація єдиного податку',
      organization: 'fopSohokon',
      schedule: taskResponse.schedule,
      chatId: null,
      chatName: null,
      activeFrom: '2026-11-01',
      isEnabled: true,
      nextDueDates: taskResponse.nextDueDates,
    });
  });

  it('rejects unknown codes', () => {
    expect(() => mapReminderTask({ ...taskResponse, organization: 'other' })).toThrow(
      /організація/,
    );
    expect(() =>
      mapReminderTask({ ...taskResponse, schedule: { ...taskResponse.schedule, dueRule: 'x' } }),
    ).toThrow(/правило терміну/);
  });
});
