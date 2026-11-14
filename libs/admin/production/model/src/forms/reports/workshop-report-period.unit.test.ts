import { describe, expect, it } from 'vitest';

import {
  previousReportPeriod,
  reportMonthCount,
  reportPeriodProblem,
} from './workshop-report-period';

describe('workshop report period', () => {
  it('counts months across a year', () => {
    expect(reportMonthCount('2025-11', '2026-02')).toBe(4);
    expect(reportMonthCount('2026-13', '2026-02')).toBeNull();
  });

  it('names the problems of a period', () => {
    expect(reportPeriodProblem('2026-11', '2026-10', '2026-11')).toMatch(/пізніше/);
    expect(reportPeriodProblem('2025-01', '2026-11', '2026-11')).toMatch(/12 місяців/);
    expect(reportPeriodProblem('2026-11', '2026-12', '2026-11')).toMatch(/не почався/);
    expect(reportPeriodProblem('2025-12', '2026-11', '2026-11')).toBeNull();
  });

  it('compares with the same number of months before', () => {
    expect(previousReportPeriod('2026-01', '2026-02')).toEqual({ from: '2025-11', to: '2025-12' });
    expect(previousReportPeriod('2026-11', '2026-11')).toEqual({ from: '2026-10', to: '2026-10' });
  });
});
