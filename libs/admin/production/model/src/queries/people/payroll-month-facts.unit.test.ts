import { describe, expect, it } from 'vitest';

import {
  payrollMissingRoles,
  payrollMonthPermissions,
  payrollMonthPeople,
} from './payroll-month-facts';

import type { PayrollMonth } from '../../entities/people/payroll';

const month = (patch: Partial<PayrollMonth>) =>
  ({
    master: null,
    chief: null,
    lines: [],
    permissions: { canSetUp: true, canPay: true, canClose: true, canReopen: true },
    ...patch,
  }) as PayrollMonth;

describe('payroll month facts', () => {
  it('names the roles still to choose', () => {
    expect(payrollMissingRoles(month({}))).toEqual(['не вибрано майстра', 'не вибрано начальника']);
    expect(payrollMissingRoles(month({ master: { employeeId: 1 } as never }))).toEqual([
      'не вибрано начальника',
    ]);
  });

  it('lists only working people for payments', () => {
    const lines = [
      { employeeId: 1, name: 'Олена', position: 'Швачка', isActive: true },
      { employeeId: 2, name: 'Марія', position: 'Швачка', isActive: false },
    ];
    expect(payrollMonthPeople(month({ lines: lines as never }))).toEqual([
      { employeeId: 1, name: 'Олена', position: 'Швачка' },
    ]);
  });

  it('narrows the server rights by «Права доступу»', () => {
    const view = payrollMonthPermissions(month({}).permissions, {
      canCreate: false,
      canEdit: true,
    });
    expect(view).toEqual({
      canSetUp: true,
      canPay: false,
      canClose: true,
      canReopen: true,
      canChange: true,
    });
  });
});
