import { describe, expect, it } from 'vitest';

import { mapReminderOccurrencePage } from './reminder-occurrence.mapper';
import { occurrenceResponse } from '../../testing/reminder-fixtures';

describe('mapReminderOccurrencePage', () => {
  it('maps closed periods with who closed them', () => {
    const page = mapReminderOccurrencePage({ items: [occurrenceResponse], total: 1 });
    expect(page.total).toBe(1);
    expect(page.items[0]?.closedBy?.name).toBe('Олена Бух');
    expect(page.items[0]?.actions[0]?.kind).toBe('done');
  });

  it('rejects a broken date', () => {
    expect(() =>
      mapReminderOccurrencePage({
        items: [{ ...occurrenceResponse, dueDate: '09.11.2026' }],
        total: 1,
      }),
    ).toThrow(/термін/);
  });
});
