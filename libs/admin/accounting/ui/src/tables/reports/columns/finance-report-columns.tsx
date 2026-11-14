import { transactionTypeLabels } from '@admin/accounting/model';
import { Box, Typography } from '@mui/material';

import {
  expense,
  income,
  money,
  operations,
  reportClipped as clipped,
  reportMono as mono,
  result,
  share,
  text,
} from './finance-report-cell-columns';
import { operationsReportColumns } from './finance-report-operations-columns';

import type { FinanceReportGridRow as Row } from './finance-report-cell-columns';
import type { FinanceReport, FinanceReportRow } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

/** The columns of a built report, by its kind. */
export function financeReportColumns(report: FinanceReport): GridColDef<Row>[] {
  const currencies = new Set(report.rows.map((row) => row.currency)).size;
  const currency: GridColDef<Row>[] =
    currencies > 1 ? [{ field: 'currency', headerName: 'Валюта', width: 90 }] : [];
  switch (report.kind) {
    case 'Summary':
      return [
        { field: 'currency', headerName: 'Валюта', width: 110 },
        operations,
        income,
        expense,
        result,
      ];
    case 'ExpenseStructure': {
      const totals = new Map(report.totals.map((total) => [total.currency, total.expenseMinor]));
      return [
        {
          field: 'category',
          headerName: 'Категорія',
          flex: 1,
          minWidth: 260,
          sortable: false,
          renderCell: ({ row }) =>
            row.rowType === 'Subcategory' ? (
              <Typography variant="body2" color="text.secondary" sx={{ pl: 3, ...clipped }}>
                {row.subcategory}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 600, ...clipped }}>
                {row.category}
              </Typography>
            ),
        },
        ...currency,
        { ...operations, sortable: false },
        { ...money('expenseMinor', 'Сума витрат', (row) => row.expenseMinor), sortable: false },
        {
          field: 'share',
          headerName: 'Частка',
          width: 100,
          align: 'right',
          headerAlign: 'right',
          sortable: false,
          renderCell: ({ row }) => (
            <Box component="span" sx={{ ...mono, color: 'text.secondary' }}>
              {share(row, totals)}
            </Box>
          ),
        },
      ];
    }
    case 'Categories':
      return [
        {
          field: 'type',
          headerName: 'Тип',
          width: 110,
          valueGetter: (value: FinanceReportRow['type']) =>
            value ? transactionTypeLabels[value] : '',
        },
        text('category', 'Категорія'),
        text('subcategory', 'Підкатегорія'),
        ...currency,
        operations,
        income,
        expense,
      ];
    case 'Accounts':
      return [
        text('account', 'Рахунок'),
        ...currency,
        operations,
        income,
        expense,
        money(
          'incomingTransfersMinor',
          'Перекази на рахунок',
          (row) => row.incomingTransfersMinor ?? 0,
        ),
        money(
          'outgoingTransfersMinor',
          'Перекази з рахунку',
          (row) => row.outgoingTransfersMinor ?? 0,
        ),
        money('resultMinor', 'Чистий рух', (row) => row.resultMinor),
      ];
    case 'Counterparties':
      return [
        text('counterparty', 'Контрагент', 240),
        ...currency,
        operations,
        income,
        expense,
        result,
      ];
    case 'Operations':
      return operationsReportColumns();
  }
}
