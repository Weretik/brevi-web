import {
  formatLedgerDate,
  formatSignedMinor,
  movementSourceLabels,
  transactionCounterpartyLabel,
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
  /** The menu action that calls `onVoid`; «Анулювати» by default. */
  actionLabel?: string;
  ariaLabel?: string;
  emptyLabel?: string;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

const voided = (row: FinanceTransaction) => row.status === 'Void';
const struck = (row: FinanceTransaction) =>
  voided(row) ? { textDecoration: 'line-through', color: 'text.disabled' } : undefined;

const signed = (row: FinanceTransaction) =>
  formatSignedMinor(row.type, row.amountMinor, row.currency);

const twoLines = { py: 0.5, lineHeight: 1.3, minWidth: 0 } as const;
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

const columns: GridColDef<FinanceTransactionRow>[] = [
  {
    field: 'date',
    headerName: 'Дата',
    width: 112,
    renderCell: ({ row }) => (
      <Stack sx={twoLines}>
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
  {
    field: 'description',
    headerName: 'Опис і контрагент',
    flex: 1,
    minWidth: 260,
    sortable: false,
    renderCell: ({ row }) => {
      const label = transactionCounterpartyLabel(row);
      const counterpartyProblem =
        row.verification === 'NeedsCounterpartyReview'
          ? verificationProblemLabels.NeedsCounterpartyReview
          : null;
      return (
        <Stack sx={twoLines}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
            {voided(row) && <FinanceProblemPill label="Анульовано" />}
            <Box component="span" sx={{ fontWeight: 600, ...clipped, ...struck(row) }}>
              {row.description || row.comment || '—'}
            </Box>
          </Stack>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={clipped}>
              {[label.name === '—' ? null : label.name, label.caption]
                .filter(Boolean)
                .join(' · ') || 'Без контрагента'}
            </Typography>
            {label.missing && <FinanceProblemPill label="Немає в довіднику" />}
            {counterpartyProblem && <FinanceProblemPill label={counterpartyProblem} />}
          </Stack>
        </Stack>
      );
    },
  },
  {
    field: 'categoryRootName',
    headerName: 'Категорія',
    width: 220,
    sortable: false,
    renderCell: ({ row }) =>
      row.categoryRootName ? (
        <Box component="span" sx={clipped}>
          {[row.categoryRootName, row.subcategoryName].filter(Boolean).join(' › ')}
        </Box>
      ) : (
        <FinanceProblemPill label={verificationProblemLabels.NeedsCategory ?? 'Без категорії'} />
      ),
  },
  { field: 'accountName', headerName: 'Рахунок', width: 170, sortable: false },
  {
    field: 'amountMinor',
    headerName: 'Сума',
    width: 150,
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
];

/** «Операції»: 50 rows per page from the server; sort by date or amount. */
export function FinanceTransactionsGrid({
  rows,
  rowCount,
  onVoid,
  actionLabel = 'Анулювати',
  ariaLabel = 'Операції',
  emptyLabel = 'Операцій поки немає',
  ...props
}: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel={ariaLabel}
      rows={rows.map((row) => ({
        ...row,
        name: `${formatLedgerDate(row.date)} ${signed(row)}`,
      }))}
      columns={columns}
      loading={props.loading}
      searching={props.searching}
      unavailable={props.unavailable}
      emptyLabel={emptyLabel}
      notFoundLabel="За цими фільтрами операцій немає"
      menuLabel="Дії операції"
      selectable={false}
      selection={noSelection}
      onSelectionChange={() => undefined}
      onView={props.onView}
      onEdit={props.onEdit}
      onDelete={onVoid}
      deleteLabel={actionLabel}
      deleteRight="edit"
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
