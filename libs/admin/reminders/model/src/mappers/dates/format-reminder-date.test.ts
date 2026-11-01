import { describe, expect, it } from 'vitest';

import { formatReminderDate, formatReminderDateTime } from './format-reminder-date';

describe('reminder dates', () => {
  it('formats ISO dates as dd.MM.yyyy', () => {
    expect(formatReminderDate('2026-11-09')).toBe('09.11.2026');
    expect(formatReminderDate(null)).toBe('—');
  });

  it('formats date-times in Kyiv time', () => {
    expect(formatReminderDateTime('2026-11-02T07:05:00Z')).toBe('02.11.2026, 09:05');
  });
});
