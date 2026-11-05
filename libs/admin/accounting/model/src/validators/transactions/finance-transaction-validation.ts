import { parseMoneyToMinor } from '../../mappers/money/finance-money';

import type { CategoryDirection, LedgerScope } from '../../entities/categories/finance-category';

export interface FinanceTransactionFormValues {
  date: string;
  type: CategoryDirection;
  accountId: string;
  /** Root category; the operation stores the subcategory when one is picked. */
  rootId: string;
  /** Empty when no subcategory is picked. */
  subcategoryId: string;
  amount: string;
  oneoffName: string;
  description: string;
  comment: string;
}

export type FinanceTransactionField = keyof FinanceTransactionFormValues;
export type FinanceTransactionFieldErrors = Partial<Record<FinanceTransactionField, string>>;

/** Limits shared with BreviERP `FinanceTransactionDetails`. */
export const financeTransactionLimits = {
  oneoffName: 250,
  description: 250,
  comment: 1500,
} as const;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Date of a record of one area: the current books from the cutover date on, «Домашня бухгалтерія»
 * before it. An unchanged date of an existing record (`previousDate`) is accepted as is.
 */
export function ledgerDateProblem(
  date: string,
  scope: LedgerScope,
  cutoverDate: string,
  previousDate: string | null = null,
): string | undefined {
  if (!datePattern.test(date) || date < '2000-01-01' || date > '2100-12-31')
    return 'Вкажіть дату між 2000 і 2100 роком.';
  if (date === previousDate) return undefined;
  if (scope === 'Current' && date < cutoverDate)
    return 'Поточний облік — з 01.10.2026. Давніші записи — у «Домашній бухгалтерії».';
  if (scope === 'LegacyArchive' && date >= cutoverDate)
    return '«Домашня бухгалтерія» — до 30.09.2026. Новіші записи — у поточному обліку.';
  return undefined;
}

/** Positive amount: «62 546,40» → no error. */
export function positiveAmountProblem(text: string): string | undefined {
  const minor = parseMoneyToMinor(text);
  if (minor === null) return 'Вкажіть суму, наприклад 1 250,40.';
  if (minor <= 0) return 'Сума має бути більшою за нуль.';
  return undefined;
}

export function validateFinanceTransaction(
  values: FinanceTransactionFormValues,
  scope: LedgerScope,
  cutoverDate: string,
  previousDate: string | null,
): FinanceTransactionFieldErrors {
  const errors: FinanceTransactionFieldErrors = {};
  const date = ledgerDateProblem(values.date, scope, cutoverDate, previousDate);
  if (date) errors.date = date;
  if (!values.accountId) errors.accountId = 'Оберіть рахунок.';
  if (!values.rootId) errors.rootId = 'Оберіть категорію.';
  const amount = positiveAmountProblem(values.amount);
  if (amount) errors.amount = amount;
  for (const field of ['oneoffName', 'description', 'comment'] as const) {
    const limit = financeTransactionLimits[field];
    if (values[field].trim().length > limit) errors[field] = `Не більше ${limit} символів.`;
  }
  return errors;
}
