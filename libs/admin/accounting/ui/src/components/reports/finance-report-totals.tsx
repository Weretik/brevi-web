import { formatFinanceCount, formatMinor, financeOperationForms } from '@admin/accounting/model';

import { FinanceTotalsBar } from '../journal/finance-totals-bar';

import type { FinanceReportTotal } from '@admin/accounting/model';

/** Income, expense and the difference of a report per currency; transfers are not in them. */
export function FinanceReportTotals({ totals }: { totals: FinanceReportTotal[] }) {
  const tail = (currency: string) => (totals.length > 1 ? ` ${currency}` : '');
  return (
    <FinanceTotalsBar
      ariaLabel="Підсумки звіту"
      items={totals.flatMap((total) => [
        {
          label: `Усього${tail(total.currency)}`,
          value: formatFinanceCount(total.operations, financeOperationForms),
        },
        {
          label: `Доходи${tail(total.currency)}`,
          value: `+${formatMinor(total.incomeMinor, total.currency)}`,
          tone: 'income' as const,
        },
        {
          label: `Витрати${tail(total.currency)}`,
          value: `−${formatMinor(total.expenseMinor, total.currency)}`,
          tone: 'expense' as const,
        },
        {
          label: `Різниця${tail(total.currency)}`,
          value: formatMinor(total.resultMinor, total.currency),
          tone: 'strong' as const,
        },
      ])}
    />
  );
}
