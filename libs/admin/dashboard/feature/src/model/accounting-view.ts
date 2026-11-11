import { formatMinor } from '@admin/accounting/model';
import { purchaseInvoiceStatus, purchaseInvoiceStatusLabels } from '@admin/purchasing/model';

import { toDeskList } from './desk-list';

import type { DashboardMetric } from './dashboard-view';
import type { DeskList, DeskListRow } from './desk-list';
import type { FinanceOverview, FinanceOverviewCurrency } from '@admin/accounting/model';
import type { PurchaseInvoice } from '@admin/purchasing/model';

const months = [
  'січень',
  'лютий',
  'березень',
  'квітень',
  'травень',
  'червень',
  'липень',
  'серпень',
  'вересень',
  'жовтень',
  'листопад',
  'грудень',
];

/** From the first day of the month of `today` (yyyy-mm-dd) to `today`, with the month's name. */
export function monthSoFar(today: string): { from: string; to: string; name: string } {
  const month = Number(today.slice(5, 7));
  return { from: `${today.slice(0, 8)}01`, to: today, name: months[month - 1] ?? '' };
}

/** The hryvnia books first: the desk shows one currency, the overview page shows the rest. */
export const mainCurrency = (overview: FinanceOverview): FinanceOverviewCurrency | null =>
  overview.currencies.find((x) => x.currency === 'UAH') ?? overview.currencies[0] ?? null;

/** Balance and the month: income, expense, difference. An unknown balance is marked with its reason. */
export function accountingMetrics(
  money: FinanceOverviewCurrency,
  month: string,
): DashboardMetric[] {
  const sum = (minor: number) => formatMinor(minor, money.currency);
  return [
    {
      label: 'Залишок',
      value: sum(money.balanceMinor),
      ...(money.unconfirmedCutoverCount > 0
        ? {
            note: {
              text: `не підтверджено рахунків: ${money.unconfirmedCutoverCount}`,
              tone: 'error' as const,
            },
          }
        : {}),
    },
    { label: `Надходження, ${month}`, value: sum(money.incomeMinor) },
    { label: `Витрати, ${month}`, value: sum(money.expenseMinor) },
    {
      label: 'Різниця',
      value: sum(money.differenceMinor),
      ...(money.differenceMinor < 0
        ? { note: { text: 'витрат більше', tone: 'error' as const } }
        : {}),
    },
  ];
}

/**
 * «Потребують перевірки»: what the operations miss, by reason (an operation may miss both). Without either reason
 * the operations are counted as one line.
 */
export function reviewList(overview: FinanceOverview): DeskList {
  const reasons: [string, string, number][] = [
    ['category', 'Без категорії', overview.needsCategoryCount],
    ['counterparty', 'Контрагент не підтверджений', overview.needsCounterpartyCount],
  ];
  const shown = reasons.filter(([, , count]) => count > 0);
  const lines =
    shown.length > 0
      ? shown
      : [['review', 'Операції на перевірці', overview.needsReviewCount] as const];
  return toDeskList(
    lines
      .filter(([, , count]) => count > 0)
      .map<DeskListRow>(([key, name, count]) => ({
        key,
        name,
        href: '/accounting/review',
        mark: { text: `операцій: ${count}`, tone: 'warning' },
      })),
  );
}

/** «Куди пішли гроші»: the largest expense groups of the month with their sums. */
export function topExpenses(money: FinanceOverviewCurrency): DeskList {
  return toDeskList(
    money.topExpenses.map<DeskListRow>((x) => ({
      key: x.categoryId ?? 'none',
      name: x.name,
      value: formatMinor(x.amountMinor, money.currency),
    })),
  );
}

/** «Рахунки на закупку» that need a look, each with its first reason. */
export function invoiceProblems(invoices: readonly PurchaseInvoice[]): DeskList {
  return toDeskList(
    invoices.map<DeskListRow>((invoice) => {
      const status = purchaseInvoiceStatus(invoice);
      return {
        key: invoice.messageId,
        name: invoice.supplierName ?? invoice.fromUser ?? 'Без постачальника',
        href: '/accounting/purchase-invoices',
        mark: {
          text: status.notes[0] ?? purchaseInvoiceStatusLabels[status.status],
          tone: status.status === 'Error' ? 'error' : 'warning',
        },
      };
    }),
  );
}
