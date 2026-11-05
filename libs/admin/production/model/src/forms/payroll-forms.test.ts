import { describe, expect, it } from 'vitest';

import {
  createPayrollAdjustmentValues,
  createPayrollPaymentValues,
  formatShare,
  parseIssued,
  payrollAdjustmentBody,
  payrollPaymentBody,
  validatePayrollAdjustment,
  validatePayrollPayment,
} from './payroll-forms';
import { payrollCsv } from '../queries/payroll-csv';

import type { PayrollLine, PayrollMonth } from '../entities/payroll';

describe('payroll forms', () => {
  it('checks a payment and builds its body', () => {
    const empty = createPayrollPaymentValues('2026-11-04');
    expect(Object.keys(validatePayrollPayment(empty, '2026-11-04'))).toEqual([
      'employeeId',
      'amount',
    ]);
    const future = { ...empty, employeeId: 3, amount: '500', paidOn: '2026-11-05' };
    expect(validatePayrollPayment(future, '2026-11-04').paidOn).toBeDefined();
    const values = { ...empty, employeeId: 3, amount: '1 500,50', comment: '  ' };
    expect(validatePayrollPayment(values, '2026-11-04')).toEqual({});
    expect(payrollPaymentBody(values)).toEqual({
      employeeId: 3,
      paidOn: '2026-11-04',
      kind: 'Advance',
      amount: 1500.5,
      comment: null,
    });
  });

  it('turns a deduction into a negative amount and needs a reason', () => {
    const values = {
      ...createPayrollAdjustmentValues(3),
      sign: 'deduction' as const,
      amount: '29,75',
    };
    expect(validatePayrollAdjustment(values).reason).toBeDefined();
    expect(payrollAdjustmentBody({ ...values, reason: 'Брак тканини' })).toEqual({
      employeeId: 3,
      amount: -29.75,
      reason: 'Брак тканини',
    });
  });

  it('parses «Видано» and shows shares as percent', () => {
    expect(parseIssued('')).toEqual({ amount: null });
    expect(parseIssued('1200,5')).toEqual({ amount: 1200.5 });
    expect(parseIssued('-1')).toBeNull();
    expect(formatShare(0.2174)).toBe('21,74 %');
    expect(formatShare(null)).toBe('—');
  });

  it('exports the month as CSV for Excel', () => {
    const line = {
      employeeId: 1,
      name: 'Андреева',
      position: 'Швачка',
      isActive: true,
      minutes: 450,
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
    } satisfies PayrollLine;
    const csv = payrollCsv({ lines: [line] } as unknown as PayrollMonth);
    expect(csv.startsWith('﻿Працівник;Посада;Години')).toBe(true);
    expect(csv).toContain('Андреева;Швачка;7,5;3;1029,75;0;0;0;0;0;0;-29,75;1000;500;500;');
  });
});
