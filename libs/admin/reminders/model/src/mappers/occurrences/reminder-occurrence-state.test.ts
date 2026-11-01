import { describe, expect, it } from 'vitest';

import { reminderOccurrenceState } from './reminder-occurrence-state';
import { kyivToday } from '../dates/format-reminder-date';

describe('reminderOccurrenceState', () => {
  const today = '2026-11-10';
  it.each([
    [{ status: 'done', dueDate: '2026-11-09', snoozedUntil: null }, 'done'],
    [{ status: 'open', dueDate: '2026-11-09', snoozedUntil: null }, 'overdue'],
    [{ status: 'open', dueDate: '2026-11-20', snoozedUntil: '2026-11-12' }, 'postponed'],
    [{ status: 'open', dueDate: '2026-11-20', snoozedUntil: '2026-11-10' }, 'open'],
  ] as const)('%o → %s', (occurrence, state) => {
    expect(reminderOccurrenceState(occurrence, today)).toBe(state);
  });

  it('uses the Kyiv date', () => {
    expect(kyivToday(new Date('2026-11-09T22:30:00Z'))).toBe('2026-11-10');
  });
});
