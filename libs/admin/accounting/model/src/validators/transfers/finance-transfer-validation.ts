import {
  ledgerDateProblem,
  positiveAmountProblem,
} from '../transactions/finance-transaction-validation';

import type { LedgerScope } from '../../entities/categories/finance-category';

export interface FinanceTransferFormValues {
  date: string;
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  note: string;
}

export type FinanceTransferField = keyof FinanceTransferFormValues;
export type FinanceTransferFieldErrors = Partial<Record<FinanceTransferField, string>>;

/** Limit shared with BreviERP `FinanceTransferDetails`. */
export const financeTransferNoteLimit = 1500;

/** `currencyOf` gives the currency of an account id, to refuse a transfer between currencies. */
export function validateFinanceTransfer(
  values: FinanceTransferFormValues,
  scope: LedgerScope,
  cutoverDate: string,
  previousDate: string | null,
  currencyOf: (accountId: string) => string | undefined,
): FinanceTransferFieldErrors {
  const errors: FinanceTransferFieldErrors = {};
  const date = ledgerDateProblem(values.date, scope, cutoverDate, previousDate);
  if (date) errors.date = date;
  if (!values.fromAccountId) errors.fromAccountId = 'Оберіть рахунок списання.';
  if (!values.toAccountId) errors.toAccountId = 'Оберіть рахунок зарахування.';
  else if (values.toAccountId === values.fromAccountId)
    errors.toAccountId = 'Рахунки мають бути різними.';
  else if (
    values.fromAccountId &&
    currencyOf(values.fromAccountId) !== currencyOf(values.toAccountId)
  )
    errors.toAccountId = 'Переказ можливий лише між рахунками однієї валюти.';
  const amount = positiveAmountProblem(values.amount);
  if (amount) errors.amount = amount;
  if (values.note.trim().length > financeTransferNoteLimit)
    errors.note = `Не більше ${financeTransferNoteLimit} символів.`;
  return errors;
}
