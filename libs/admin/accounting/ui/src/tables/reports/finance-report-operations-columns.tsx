import { formatLedgerDate, formatSignedMinor, movementSourceLabels } from '@admin/accounting/model';
import { Box } from '@mui/material';

import { reportMono as mono, text } from './finance-report-cell-columns';

import type { FinanceReportGridRow as Row } from './finance-report-cell-columns';
import type { FinanceReportRow } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

/** Columns of the «Операції» report: one movement per row with its signed sum and source. */
export function operationsReportColumns(): GridColDef<Row>[] {
  return [
    {
      field: 'date',
      headerName: 'Дата',
      width: 110,
      cellClassName: 'reference-mono',
      valueFormatter: (value: string | null) => (value ? formatLedgerDate(value) : ''),
    },
    text('account', 'Рахунок', 140),
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 200,
      valueGetter: (_value, row) => [row.category, row.subcategory].filter(Boolean).join(' / '),
    },
    text('counterparty', 'Контрагент', 180),
    {
      field: 'amountMinor',
      headerName: 'Сума',
      width: 150,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      valueGetter: (_value, row) =>
        row.type === 'Expense' ? -(row.amountMinor ?? 0) : (row.amountMinor ?? 0),
      renderCell: ({ row }) => (
        <Box
          component="span"
          sx={{ ...mono, color: row.type === 'Income' ? 'success.main' : 'text.primary' }}
        >
          {formatSignedMinor(row.type ?? 'Expense', row.amountMinor ?? 0, row.currency)}
        </Box>
      ),
    },
    text('note', 'Опис', 220),
    {
      field: 'source',
      headerName: 'Джерело',
      width: 170,
      valueGetter: (value: FinanceReportRow['source']) =>
        value ? movementSourceLabels[value] : '',
    },
  ];
}
