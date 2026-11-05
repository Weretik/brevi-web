import type { LedgerScope } from '../categories/finance-category';

/** «Огляд» for an area (`null` — both) and an inclusive period. */
export interface FinanceOverview {
  scope: LedgerScope | null;
  from: string;
  to: string;
  currencies: FinanceOverviewCurrency[];
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
}
