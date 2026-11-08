import { describe, expect, it } from 'vitest';

import { formatLeadNext, leadQuickDates, leadStatsRange } from './lead-dates';

const now = new Date(2026, 10, 9, 10, 30);

describe('lead dates', () => {
  it('shows today, tomorrow and overdue next contacts', () => {
    expect(formatLeadNext(new Date(2026, 10, 9, 11, 0).toISOString(), now)).toMatch(
      /^сьогодні 11:00$/,
    );
    expect(formatLeadNext(new Date(2026, 10, 10, 9, 5).toISOString(), now)).toMatch(
      /^завтра 09:05$/,
    );
    expect(formatLeadNext(new Date(2026, 10, 6, 9, 0).toISOString(), now)).toMatch(/−3 дн$/);
  });

  it('offers tomorrow at ten first', () => {
    expect(leadQuickDates(now)[0]).toEqual({ label: 'Завтра', value: '2026-11-10T10:00' });
  });

  it('counts the week as seven days with today', () => {
    expect(leadStatsRange('week', now)).toEqual({ from: '2026-11-03', to: '2026-11-09' });
    expect(leadStatsRange('today', now)).toEqual({ from: '2026-11-09', to: '2026-11-09' });
  });
});
