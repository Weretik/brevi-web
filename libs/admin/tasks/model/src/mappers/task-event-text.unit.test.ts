import { describe, expect, it } from 'vitest';

import { formatTaskDue } from './task-dates';
import { describeTaskEvent } from './task-event-text';

const by = { userId: 1, name: 'Віталій' };

describe('describeTaskEvent', () => {
  it('writes history lines in Ukrainian', () => {
    expect(describeTaskEvent({ kind: 'Created', by, at: '', details: null })).toBe(
      'Поставив завдання',
    );
    expect(describeTaskEvent({ kind: 'StatusChanged', by, at: '', details: 'InProgress' })).toBe(
      'Статус: У роботі',
    );
    expect(describeTaskEvent({ kind: 'UrgentChanged', by, at: '', details: 'false' })).toBe(
      'Зняв позначку «Терміново»',
    );
    expect(describeTaskEvent({ kind: 'Reassigned', by, at: '', details: 'Ірина' })).toBe(
      'Передав: Ірина',
    );
  });
});

describe('formatTaskDue', () => {
  const now = new Date(2026, 10, 4, 9, 0);

  it('says today, tomorrow or the date', () => {
    expect(formatTaskDue(new Date(2026, 10, 4, 17, 0).toISOString(), now, false)).toBe(
      'сьогодні 17:00',
    );
    expect(formatTaskDue(new Date(2026, 10, 5, 12, 0).toISOString(), now, false)).toBe(
      'завтра 12:00',
    );
    expect(formatTaskDue(new Date(2026, 10, 9, 8, 30).toISOString(), now, false)).toBe(
      '09.11 · 08:30',
    );
  });

  it('shows how many days an overdue task is late', () => {
    expect(formatTaskDue(new Date(2026, 10, 1, 9, 0).toISOString(), now, true)).toBe(
      '01.11 · −3 дн',
    );
  });
});
