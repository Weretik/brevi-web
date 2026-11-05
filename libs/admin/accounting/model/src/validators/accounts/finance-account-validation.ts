import { parseMoneyToMinor } from '../../mappers/money/finance-money';

import type { FinanceAccountType } from '../../entities/accounts/finance-account';

export interface FinanceAccountFormValues {
  name: string;
  type: FinanceAccountType;
  currency: string;
  iban: string;
  opening: string;
  openingDate: string;
  note: string;
}

export type FinanceAccountField = keyof FinanceAccountFormValues;
export type FinanceAccountFieldErrors = Partial<Record<FinanceAccountField, string>>;

/** Limits shared with BreviERP `FinanceAccountDetails`. */
export const financeAccountLimits = { name: 120, iban: 64, note: 600 } as const;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function validateFinanceAccount(
  values: FinanceAccountFormValues,
): FinanceAccountFieldErrors {
  const errors: FinanceAccountFieldErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву рахунку.';
  else if (name.length > financeAccountLimits.name)
    errors.name = `Не більше ${financeAccountLimits.name} символів.`;
  if (!/^[A-Za-z]{3}$/.test(values.currency.trim()))
    errors.currency = 'Три латинські літери, наприклад UAH.';
  if (values.iban.replace(/[^0-9A-Za-z]/g, '').length > financeAccountLimits.iban)
    errors.iban = `Не більше ${financeAccountLimits.iban} літер і цифр.`;
  if (parseMoneyToMinor(values.opening) === null)
    errors.opening = 'Вкажіть суму, наприклад 62 546,40.';
  if (
    !datePattern.test(values.openingDate) ||
    values.openingDate < '2000-01-01' ||
    values.openingDate > '2100-12-31'
  )
    errors.openingDate = 'Вкажіть дату між 2000 і 2100 роком.';
  if (values.note.trim().length > financeAccountLimits.note)
    errors.note = `Не більше ${financeAccountLimits.note} символів.`;
  return errors;
}

export interface FinanceCutoverFormValues {
  balance: string;
}

export function validateFinanceCutover(values: FinanceCutoverFormValues): string | null {
  return parseMoneyToMinor(values.balance) === null
    ? 'Вкажіть залишок, наприклад 62 546,40.'
    : null;
}
