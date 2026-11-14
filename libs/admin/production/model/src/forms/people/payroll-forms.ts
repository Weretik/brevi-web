import {
  PAYROLL_COMMENT_MAX_LENGTH,
  PAYROLL_MAX_AMOUNT,
  PAYROLL_REASON_MAX_LENGTH,
  PAYROLL_REASON_MIN_LENGTH,
} from '../../entities/people/payroll';

import type {
  CreatePayrollAdjustmentBody,
  CreatePayrollPaymentBody,
  PayrollPaymentKind,
} from '../../entities/people/payroll';

/** UAH with up to two decimals, comma or dot; null when empty, undefined when not a sum. */
export function parsePayrollAmount(raw: string): number | null | undefined {
  const text = raw.trim().replace(',', '.').replace(/\s/g, '');
  if (!text) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return undefined;
  return Number(text);
}

const AMOUNT = 'Сума від 0,01 до 10 000 000 грн, до двох знаків після коми.';

export function validatePayrollReason(reason: string): string | null {
  const length = reason.trim().length;
  if (length < PAYROLL_REASON_MIN_LENGTH) return 'Вкажіть причину (від 3 символів).';
  return length > PAYROLL_REASON_MAX_LENGTH ? 'Причина — до 500 символів.' : null;
}

export interface PayrollPaymentFormValues {
  employeeId: number | null;
  paidOn: string;
  kind: PayrollPaymentKind;
  amount: string;
  comment: string;
}

export type PayrollPaymentErrors = Partial<Record<keyof PayrollPaymentFormValues, string>>;

export const createPayrollPaymentValues = (
  today: string,
  employeeId: number | null = null,
): PayrollPaymentFormValues => ({
  employeeId,
  paidOn: today,
  kind: 'Advance',
  amount: '',
  comment: '',
});

export function validatePayrollPayment(
  values: PayrollPaymentFormValues,
  today: string,
): PayrollPaymentErrors {
  const errors: PayrollPaymentErrors = {};
  if (values.employeeId === null) errors.employeeId = 'Оберіть працівника.';
  if (!values.paidOn) errors.paidOn = 'Вкажіть дату виплати.';
  else if (values.paidOn > today) errors.paidOn = 'Дата виплати не може бути пізніше сьогодні.';
  const amount = parsePayrollAmount(values.amount);
  if (typeof amount !== 'number' || amount <= 0 || amount > PAYROLL_MAX_AMOUNT)
    errors.amount = AMOUNT;
  if (values.comment.trim().length > PAYROLL_COMMENT_MAX_LENGTH)
    errors.comment = 'Коментар — до 1000 символів.';
  return errors;
}

export const payrollPaymentBody = (values: PayrollPaymentFormValues): CreatePayrollPaymentBody => ({
  employeeId: values.employeeId ?? 0,
  paidOn: values.paidOn,
  kind: values.kind,
  amount: parsePayrollAmount(values.amount) ?? 0,
  comment: values.comment.trim() || null,
});

export type PayrollAdjustmentSign = 'accrual' | 'deduction';

export interface PayrollAdjustmentFormValues {
  employeeId: number | null;
  sign: PayrollAdjustmentSign;
  amount: string;
  reason: string;
}

export type PayrollAdjustmentErrors = Partial<Record<keyof PayrollAdjustmentFormValues, string>>;

export const createPayrollAdjustmentValues = (
  employeeId: number | null = null,
): PayrollAdjustmentFormValues => ({ employeeId, sign: 'accrual', amount: '', reason: '' });

export function validatePayrollAdjustment(
  values: PayrollAdjustmentFormValues,
): PayrollAdjustmentErrors {
  const errors: PayrollAdjustmentErrors = {};
  if (values.employeeId === null) errors.employeeId = 'Оберіть працівника.';
  const amount = parsePayrollAmount(values.amount);
  if (typeof amount !== 'number' || amount <= 0 || amount > PAYROLL_MAX_AMOUNT)
    errors.amount = AMOUNT;
  const reason = validatePayrollReason(values.reason);
  if (reason) errors.reason = reason;
  return errors;
}

export const payrollAdjustmentBody = (
  values: PayrollAdjustmentFormValues,
): CreatePayrollAdjustmentBody => {
  const amount = parsePayrollAmount(values.amount) ?? 0;
  return {
    employeeId: values.employeeId ?? 0,
    amount: values.sign === 'deduction' ? -amount : amount,
    reason: values.reason.trim(),
  };
};

/** «Видано»: empty clears it; otherwise 0–10 000 000 UAH. */
export function parseIssued(raw: string): { amount: number | null } | null {
  const amount = parsePayrollAmount(raw);
  if (amount === undefined || (amount !== null && amount > PAYROLL_MAX_AMOUNT)) return null;
  return { amount };
}

const share = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** «8 %» of 0.08; «—» when not filled in. */
export const formatShare = (fraction: number | null) =>
  fraction === null ? '—' : `${share.format(fraction * 100)} %`;

/** The current month «2026-11» of a day «2026-11-04». */
export const payrollMonthOf = (day: string) => day.slice(0, 7);
