import {
  formatLedgerDate,
  formatMinor,
  formatSignedMinor,
  movementSourceLabels,
  transactionTypeLabels,
} from '@admin/accounting/model';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import type { FinanceReport, FinanceReportRow } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  report: FinanceReport | null;
  loading: boolean;
  /** Text while nothing is built or the request failed. */
  emptyLabel: string;
}

type Row = FinanceReportRow & { key: number };

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

function money(
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

const operations: GridColDef<Row> = {
  field: 'operations',
  headerName: 'Операцій',
  width: 100,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  cellClassName: 'reference-mono',
};

const text = (
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

const income = money('incomeMinor', 'Доходи', (row) => row.incomeMinor, 'income');
const expense = money('expenseMinor', 'Витрати', (row) => row.expenseMinor, 'expense');
const result = money('resultMinor', 'Різниця', (row) => row.resultMinor);

/** Share of a row in the expenses of its currency, «12,4 %». */
function share(row: Row, totals: Map<string, number>): string {
  const all = totals.get(row.currency) ?? 0;
  if (!all) return '';
  return `${((row.expenseMinor / all) * 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function columns(report: FinanceReport): GridColDef<Row>[] {
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
}

/** The rows of a built report; columns follow its kind. */
export function FinanceReportGrid({ report, loading, emptyLabel }: Props) {
  const theme = useTheme();
  const rows: Row[] = (report?.rows ?? []).map((row, key) => ({ ...row, key }));
  return (
    <Stack sx={{ width: '100%', minWidth: 0, height: 'var(--admin-table-height)' }}>
      <DataGrid
        aria-label="Рядки звіту"
        rows={rows}
        getRowId={(row) => row.key}
        columns={report ? columns(report) : []}
        loading={loading}
        rowHeight={44}
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        disableColumnMenu
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 100, page: 0 } } }}
        getRowClassName={({ row }) =>
          row.rowType === 'Group' && report?.kind === 'ExpenseStructure' ? 'report-group' : ''
        }
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: emptyLabel,
        }}
        sx={{
          border: 0,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0,
          '& .reference-mono': mono,
          '& .report-group': { bgcolor: 'action.hover' },
        }}
      />
    </Stack>
  );
}
