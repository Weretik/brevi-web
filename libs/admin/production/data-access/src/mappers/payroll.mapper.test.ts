import { describe, expect, it } from 'vitest';

import { mapPayrollMonth, mapPayrollYear, mapTimesheetDay } from './payroll.mapper';

const line = {
  employeeId: 1,
  name: 'Андреева',
  position: 'Швачка',
  isActive: true,
  minutes: 480,
  sewn: 3,
  sewing: 1029.75,
  cut: 0,
  cutting: 0,
  bonus: 0,
  master: 0,
  chief: 0,
  embroidery: 0,
  other: -29.75,
  accrued: 1000,
  paid: 500,
  due: 500,
  issued: null,
};

describe('payroll mapper', () => {
  it('maps a month with a person found by position and a cancelled payment', () => {
    const month = mapPayrollMonth({
      month: '2026-11',
      isClosed: false,
      closedAt: null,
      closedByName: null,
      rates: {
        bonus: 0.08,
        bonusThreshold: 17500,
        cutting: 0.2174,
        master: 0.11,
        chief: null,
        embroidery: 1,
      },
      master: { employeeId: 2, name: 'Витковська', isAssigned: false },
      chief: null,
      stitches: 0,
      embroideryEmployee: null,
      totalSewing: 1029.75,
      warnings: ['Не обрано начальника цеху: його частка не нарахована.'],
      lines: [line],
      totals: { ...line, issued: 0 },
      payments: [
        {
          id: 5,
          employeeId: 1,
          employeeName: 'Андреева',
          paidOn: '2026-11-04',
          kind: 'Advance',
          amount: 500,
          comment: null,
          createdAt: '2026-11-04T10:00:00Z',
          createdByName: 'Власниця',
          voidedAt: '2026-11-04T11:00:00Z',
          voidedByName: 'Власниця',
          voidReason: 'Помилка',
        },
      ],
      adjustments: [],
      permissions: { canSetUp: true, canPay: false, canClose: false, canReopen: false },
    });

    expect(month.master?.isAssigned).toBe(false);
    expect(month.rates.chief).toBeNull();
    expect(month.lines[0]?.other).toBe(-29.75);
    expect(month.payments[0]?.voidReason).toBe('Помилка');
    expect(month.permissions.canPay).toBe(false);
  });

  it('rejects an unknown payment kind', () => {
    expect(() => mapPayrollMonth({ month: '2026-11', payments: [{ kind: 'Bitcoin' }] })).toThrow();
  });

  it('maps a day of the timesheet and a year', () => {
    const day = mapTimesheetDay({
      date: '2026-11-04',
      canEdit: true,
      isMonthClosed: false,
      rows: [
        {
          employeeId: 1,
          name: 'Андреева',
          position: 'Швачка',
          isActive: true,
          minutes: null,
          version: null,
        },
      ],
      changes: [],
      month: { month: '2026-11', days: [], employees: [] },
    });
    const year = mapPayrollYear({
      year: 2026,
      months: [{ month: '2026-11', isClosed: true, accrued: 1000 }],
      rows: [
        { employeeId: 1, name: 'Андреева', position: 'Швачка', accrued: [null, 1000], total: 1000 },
      ],
    });

    expect(day.rows[0]?.minutes).toBeNull();
    expect(year.rows[0]?.accrued).toEqual([null, 1000]);
  });
});
