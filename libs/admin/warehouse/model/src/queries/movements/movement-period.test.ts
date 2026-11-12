import { describe, expect, it } from 'vitest';

import { movementPeriodRange } from './movement-period';

describe('movementPeriodRange', () => {
  it('gives the dates of each preset', () => {
    expect(movementPeriodRange('today', '2026-11-12')).toEqual({
      from: '2026-11-12',
      to: '2026-11-12',
    });
    expect(movementPeriodRange('week', '2026-11-12')).toEqual({
      from: '2026-11-09',
      to: '2026-11-12',
    });
    expect(movementPeriodRange('week', '2026-11-09')).toEqual({
      from: '2026-11-09',
      to: '2026-11-09',
    });
    expect(movementPeriodRange('week', '2026-11-15')).toEqual({
      from: '2026-11-09',
      to: '2026-11-15',
    });
    expect(movementPeriodRange('month', '2026-11-12')).toEqual({
      from: '2026-11-01',
      to: '2026-11-12',
    });
    expect(movementPeriodRange('quarter', '2026-11-12')).toEqual({
      from: '2026-10-01',
      to: '2026-11-12',
    });
    expect(movementPeriodRange('quarter', '2026-03-31')).toEqual({
      from: '2026-01-01',
      to: '2026-03-31',
    });
    expect(movementPeriodRange('lastMonth', '2026-01-12')).toEqual({
      from: '2025-12-01',
      to: '2025-12-31',
    });
    expect(movementPeriodRange('all', '2026-11-12')).toEqual({ from: null, to: null });
  });
});
