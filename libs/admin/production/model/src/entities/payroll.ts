export const PAYROLL_MAX_AMOUNT = 10_000_000;
export const PAYROLL_COMMENT_MAX_LENGTH = 1000;
export const PAYROLL_REASON_MAX_LENGTH = 500;
export const PAYROLL_REASON_MIN_LENGTH = 3;
export const PAYROLL_MAX_STITCHES = 1_000_000_000;

export const payrollPaymentKinds = ['Advance', 'Card', 'Cash', 'Other'] as const;
export type PayrollPaymentKind = (typeof payrollPaymentKinds)[number];

export const payrollPaymentKindLabels: Record<PayrollPaymentKind, string> = {
  Advance: 'Аванс',
  Card: 'На картку',
  Cash: 'Готівкою',
  Other: 'Інше',
};

/** Shares of «Параметри ціноутворення» as fractions (0.08 = 8 %); null when not filled in. */
export interface PayrollRates {
  bonus: number | null;
  bonusThreshold: number | null;
  cutting: number | null;
  master: number | null;
  chief: number | null;
  embroidery: number | null;
}

/** `isAssigned` is false when the person is found by position, not chosen. */
export interface PayrollPerson {
  employeeId: number;
  name: string;
  isAssigned: boolean;
}

/** What a worker earned in the month, was paid and is still due, in UAH. */
export interface PayrollLine {
  employeeId: number;
  name: string;
  position: string;
  isActive: boolean;
  minutes: number;
  sewn: number;
  sewing: number;
  cut: number;
  cutting: number;
  bonus: number;
  master: number;
  chief: number;
  embroidery: number;
  /** Adjustments: extra accruals minus deductions. */
  other: number;
  accrued: number;
  paid: number;
  due: number;
  /** «Видано», when entered. */
  issued: number | null;
}

export type PayrollTotals = Omit<
  PayrollLine,
  'employeeId' | 'name' | 'position' | 'isActive' | 'sewn' | 'cut' | 'issued'
> & { issued: number };

export interface PayrollPayment {
  id: number;
  employeeId: number;
  employeeName: string;
  paidOn: string;
  kind: PayrollPaymentKind;
  amount: number;
  comment: string | null;
  createdAt: string;
  createdByName: string;
  voidedAt: string | null;
  voidedByName: string | null;
  voidReason: string | null;
}

/** A positive amount is an extra accrual, a negative one a deduction. */
export interface PayrollAdjustment {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  reason: string;
  createdAt: string;
  createdByName: string;
  voidedAt: string | null;
  voidedByName: string | null;
  voidReason: string | null;
}

export interface PayrollPermissions {
  /** Roles and embroidery: the head of the workshop and Admin on an open month. */
  canSetUp: boolean;
  /** Payments, adjustments, «Видано»: Admin on an open month that has started. */
  canPay: boolean;
  canClose: boolean;
  canReopen: boolean;
}

/** «Зарплата» of a month; a closed month as it was when closed. */
export interface PayrollMonth {
  month: string;
  isClosed: boolean;
  closedAt: string | null;
  closedByName: string | null;
  rates: PayrollRates;
  master: PayrollPerson | null;
  chief: PayrollPerson | null;
  stitches: number;
  embroideryEmployee: PayrollPerson | null;
  /** Sewing of all workers: the base of the master and chief shares. */
  totalSewing: number;
  /** Problems of the calculation; they block closing. */
  warnings: string[];
  lines: PayrollLine[];
  totals: PayrollTotals;
  payments: PayrollPayment[];
  adjustments: PayrollAdjustment[];
  permissions: PayrollPermissions;
}

/** Work behind a worker's sewing and cutting, paid by `rate`. */
export interface PayrollWorkRow {
  workId: number;
  employeeId: number;
  workDate: string;
  orderId: number;
  orderNumber: number;
  modelName: string;
  kind: 'Sewing' | 'Cutting';
  quantity: number;
  rate: number;
  amount: number;
  overPlan: boolean;
}

export interface PayrollEmployee {
  month: string;
  isClosed: boolean;
  line: PayrollLine;
  work: PayrollWorkRow[];
  payments: PayrollPayment[];
  adjustments: PayrollAdjustment[];
}

export interface PayrollYearMonth {
  month: string;
  isClosed: boolean;
  accrued: number;
}

/** `accrued` has 12 values, January first; null where nothing was earned. */
export interface PayrollYearRow {
  employeeId: number;
  name: string;
  position: string;
  accrued: (number | null)[];
  total: number;
}

export interface PayrollYear {
  year: number;
  months: PayrollYearMonth[];
  rows: PayrollYearRow[];
}

export interface CreatePayrollPaymentBody {
  employeeId: number;
  paidOn: string;
  kind: PayrollPaymentKind;
  amount: number;
  comment: string | null;
}

export interface CreatePayrollAdjustmentBody {
  employeeId: number;
  amount: number;
  reason: string;
}
