import { minorToInput, parseMoneyToMinor } from '../../mappers/money/finance-money';

import type {
  FinanceAccount,
  FinanceAccountBody,
  FinanceAccountCutoverBody,
} from '../../entities/accounts/finance-account';
import type {
  FinanceAccountFormValues,
  FinanceCutoverFormValues,
} from '../../validators/accounts/finance-account-validation';

export function createFinanceAccountFormValues(
  account: FinanceAccount | null,
  today: string,
): FinanceAccountFormValues {
  return {
    name: account?.name ?? '',
    type: account?.type ?? 'Bank',
    currency: account?.currency ?? 'UAH',
    iban: account?.iban ?? '',
    opening: account ? minorToInput(account.openingMinor) : '0,00',
    openingDate: account?.openingDate ?? today,
    note: account?.note ?? '',
  };
}

/** Request fields of a create or update; call only after validation passed. */
export function financeAccountBody(
  values: FinanceAccountFormValues,
  sortOrder: number,
): FinanceAccountBody {
  return {
    name: values.name.trim(),
    type: values.type,
    currency: values.currency.trim().toUpperCase(),
    iban: values.iban.trim() || null,
    openingMinor: parseMoneyToMinor(values.opening) ?? 0,
    openingDate: values.openingDate,
    note: values.note.trim() || null,
    sortOrder,
  };
}

export function createFinanceCutoverFormValues(account: FinanceAccount): FinanceCutoverFormValues {
  return {
    balance: account.cutoverBalanceMinor === null ? '' : minorToInput(account.cutoverBalanceMinor),
  };
}

/** «Підтвердити залишок»: call only after validation passed. */
export function financeCutoverBody(
  values: FinanceCutoverFormValues,
  version: number,
): FinanceAccountCutoverBody {
  return { balanceMinor: parseMoneyToMinor(values.balance), confirmed: true, version };
}

/** Next sort order after the last row, in steps of 10 like the old Calculator. */
export function nextFinanceSortOrder(rows: readonly { sortOrder: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 10;
}
