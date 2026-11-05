import type { LedgerScope } from '../categories/finance-category';

/** «Огляд» for an area (`null` — both) and an inclusive period. */
export interface FinanceOverview {
  scope: LedgerScope | null;
  from: string;
  to: string;
  currencies: FinanceOverviewCurrency[];
  /** Active current operations of «Потребують перевірки», whatever the period. */
  needsReviewCount: number;
  /** Of them, without a category. */
  needsCategoryCount: number;
  /** Of them, with an unconfirmed finance counterparty. */
  needsCounterpartyCount: number;
}

/** An expense root category of «Куди пішли гроші»; `categoryId` is null for «Без категорії». */
export interface FinanceOverviewCategory {
  categoryId: string | null;
  name: string;
  amountMinor: number;
}

/**
 * Balance of the active accounts in the area (not limited by the period); for the current books it
 * sums confirmed accounts only, and `unconfirmedCutoverCount` > 0 means the total is unknown.
 */
export interface FinanceOverviewCurrency {
  currency: string;
  balanceMinor: number;
  unconfirmedCutoverCount: number;
  incomeMinor: number;
  expenseMinor: number;
  differenceMinor: number;
  accountCount: number;
  incomeCount: number;
  expenseCount: number;
  /** At most five largest expense roots of the period, largest first. */
  topExpenses: FinanceOverviewCategory[];
  /** Expenses outside `topExpenses`, over `otherExpenseCategoryCount` groups. */
  otherExpenseMinor: number;
  otherExpenseCategoryCount: number;
}
