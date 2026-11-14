import { formatMinor } from '@admin/accounting/model';
import { Box } from '@mui/material';

import type { FinanceReportRow } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

/** A report row with its position as the grid id. */
export type FinanceReportGridRow = FinanceReportRow & { key: number };
type Row = FinanceReportGridRow;

export const reportMono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
};
export const reportClipped = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;
const mono = reportMono;

/** A right-aligned money column; `tone` colours income or expense. */
export function money(
  field: keyof FinanceReportRow,
  headerName: string,
  value: (row: Row) => number,
  tone?: 'income' | 'expense',
): GridColDef<Row> {
  return {
    field,
    headerName,
    width: 150,
    type: 'number',
    align: 'right',
    headerAlign: 'right',
    valueGetter: (_value, row) => value(row),
    renderCell: ({ row }) => {
      const amount = value(row);
      return (
        <Box
          component="span"
          sx={{
            ...mono,
            color:
              amount === 0
                ? 'text.disabled'
                : tone === 'income'
                  ? 'success.main'
                  : tone === 'expense'
                    ? 'error.main'
                    : 'text.primary',
          }}
        >
          {formatMinor(amount, row.currency)}
        </Box>
      );
    },
  };
}

export const operations: GridColDef<Row> = {
  field: 'operations',
  headerName: 'Операцій',
  width: 100,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  cellClassName: 'reference-mono',
};

export const text = (
  field: keyof FinanceReportRow,
  headerName: string,
  minWidth = 200,
): GridColDef<Row> => ({
  field,
  headerName,
  flex: 1,
  minWidth,
  valueGetter: (value: string | null) => value ?? '',
});

export const income = money('incomeMinor', 'Доходи', (row) => row.incomeMinor, 'income');
export const expense = money('expenseMinor', 'Витрати', (row) => row.expenseMinor, 'expense');
export const result = money('resultMinor', 'Різниця', (row) => row.resultMinor);

/** Share of a row in the expenses of its currency, «12,4 %». */
export function share(row: Row, totals: Map<string, number>): string {
  const all = totals.get(row.currency) ?? 0;
  if (!all) return '';
  return `${((row.expenseMinor / all) * 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}
