import {
  formatLedgerDate,
  formatSignedMinor,
  movementSourceLabels,
  verificationProblemLabels,
} from '@admin/accounting/model';
import { ReferenceDataGrid } from '@admin/references/ui';
import { Box, Stack, Typography } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceTransaction } from '@admin/accounting/model';
import type {
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';

/** A journal row; `name` labels the row menu. */
type FinanceTransactionRow = FinanceTransaction & { name: string };

interface Props {
  rows: FinanceTransaction[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onView: (transaction: FinanceTransaction) => void;
  onEdit: (transaction: FinanceTransaction) => void;
  onVoid: (id: string) => void;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

const voided = (row: FinanceTransaction) => row.status === 'Void';
const struck = (row: FinanceTransaction) =>
  voided(row) ? { textDecoration: 'line-through', color: 'text.disabled' } : undefined;

const signed = (row: FinanceTransaction) =>
  formatSignedMinor(row.type, row.amountMinor, row.currency);

const columns: GridColDef<FinanceTransactionRow>[] = [
  {
    field: 'date',
    headerName: 'Дата',
    width: 140,
    renderCell: ({ row }) => (
      <Stack sx={{ py: 0.5, lineHeight: 1.3 }}>
        <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)', ...struck(row) }}>
          {formatLedgerDate(row.date)}
        </Box>
        {row.source !== 'Manual' && (
          <Typography variant="caption" color="text.secondary">
            {movementSourceLabels[row.source]}
          </Typography>
        )}
      </Stack>
    ),
  },
  { field: 'accountName', headerName: 'Рахунок', width: 180, sortable: false },
  {
    field: 'categoryRootName',
    headerName: 'Категорія',
    width: 180,
    sortable: false,
    valueFormatter: (value: string | null) => value ?? '—',
  },
  {
    field: 'subcategoryName',
    headerName: 'Підкатегорія',
    width: 170,
    sortable: false,
    valueFormatter: (value: string | null) => value ?? '—',
  },
  {
    field: 'amountMinor',
    headerName: 'Сума',
    width: 170,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    renderCell: ({ row }) => (
      <Box
        component="span"
        sx={{
          fontWeight: 600,
          color: row.type === 'Income' ? 'success.main' : 'error.main',
          ...struck(row),
        }}
      >
        {signed(row)}
      </Box>
    ),
  },
  {
    field: 'oneoffName',
    headerName: 'Контрагент',
    width: 190,
    sortable: false,
    renderCell: ({ row }) => {
      const problem = verificationProblemLabels[row.verification];
      return (
        <Stack sx={{ py: 0.5, gap: 0.5, alignItems: 'flex-start' }}>
          <span>{row.oneoffName || '—'}</span>
          {problem && <FinanceProblemPill label={problem} />}
        </Stack>
      );
    },
  },
  {
    field: 'description',
    headerName: 'Примітка',
    flex: 1,
    minWidth: 220,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
        {voided(row) && <FinanceProblemPill label="Анульовано" />}
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {[row.description, row.comment].filter(Boolean).join(' · ') || '—'}
        </Box>
      </Stack>
    ),
  },
];

/** «Операції»: 50 rows per page from the server; sort by date or amount. */
export function FinanceTransactionsGrid({ rows, rowCount, onVoid, ...props }: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Операції"
      rows={rows.map((row) => ({
        ...row,
        name: `${formatLedgerDate(row.date)} ${signed(row)}`,
      }))}
      columns={columns}
      loading={props.loading}
      searching={props.searching}
      unavailable={props.unavailable}
      emptyLabel="Операцій поки немає"
      notFoundLabel="За цими фільтрами операцій немає"
      menuLabel="Дії операції"
      selectable={false}
      selection={noSelection}
      onSelectionChange={() => undefined}
      onView={props.onView}
      onEdit={props.onEdit}
      onDelete={onVoid}
      deleteLabel="Анулювати"
      server={{
        rowCount,
        paginationModel: props.paginationModel,
        onPaginationModelChange: props.onPaginationModelChange,
        sortModel: props.sortModel,
        onSortModelChange: props.onSortModelChange,
      }}
    />
  );
}
