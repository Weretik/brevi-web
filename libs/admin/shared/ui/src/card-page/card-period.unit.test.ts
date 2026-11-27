import { describe, expect, it } from 'vitest';

import { cardPeriodRange, cardPeriodTitle, readCardPeriod, writeCardPeriod } from './card-period';

const today = new Date(2026, 10, 27);

describe('card period', () => {
  it('turns presets into Kyiv-day ranges ending today', () => {
    expect(cardPeriodRange('month', today)).toEqual({
      period: 'month',
      from: '2026-11-01',
      to: '2026-11-27',
    });
    expect(cardPeriodRange('quarter', today).from).toBe('2026-09-01');
    expect(cardPeriodRange('year', today).from).toBe('2026-01-01');
    expect(cardPeriodRange('all', today)).toEqual({ period: 'all' });
  });

  it('keeps only valid typed dates of a custom period', () => {
    expect(cardPeriodRange('custom', today, { from: '2026-02-01', to: 'bad' })).toEqual({
      period: 'custom',
      from: '2026-02-01',
      to: undefined,
    });
  });

  it('reads and writes the query without touching the tab', () => {
    const params = new URLSearchParams('tab=quotes&period=custom&from=2026-01-05&to=2026-01-31');
    const state = readCardPeriod(params, today);
    expect(state).toEqual({ period: 'custom', from: '2026-01-05', to: '2026-01-31' });
    expect(cardPeriodTitle(state)).toBe('05.01.2026 – 31.01.2026');
    expect(writeCardPeriod(params, { period: 'all' }).toString()).toBe('tab=quotes');
    expect(readCardPeriod(new URLSearchParams('period=week'), today).period).toBe('all');
  });
});
