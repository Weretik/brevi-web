import { formatLedgerDate, formatMinor, movementSourceLabels } from '@admin/accounting/model';
import { ReferenceDataGrid } from '@admin/references/ui';
import { Box, Stack } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceTransfer } from '@admin/accounting/model';
import type {
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';

type Row = FinanceTransfer & { name: string };

interface Props {
  rows: FinanceTransfer[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onView: (transfer: FinanceTransfer) => void;
  onEdit: (transfer: FinanceTransfer) => void;
  onVoid: (id: string) => void;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

const struck = (row: FinanceTransfer) =>
  row.status === 'Void' ? { textDecoration: 'line-through', color: 'text.disabled' } : undefined;

const columns: GridColDef<Row>[] = [
  {
    field: 'date',
    headerName: 'Дата',
    width: 130,
    renderCell: ({ row }) => (
      <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)', ...struck(row) }}>
        {formatLedgerDate(row.date)}
      </Box>
    ),
  },
  { field: 'fromAccountName', headerName: 'З рахунку', width: 200, sortable: false },
  { field: 'toAccountName', headerName: 'На рахунок', width: 200, sortable: false },
  {
    field: 'amountMinor',
    headerName: 'Сума',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    renderCell: ({ row }) => (
      <Box component="span" sx={{ fontWeight: 600, ...struck(row) }}>
        {formatMinor(row.amountMinor, row.currency)}
      </Box>
    ),
  },
  {
    field: 'note',
    headerName: 'Примітка',
    flex: 1,
    minWidth: 220,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
        {row.status === 'Void' && <FinanceProblemPill label="Анульовано" />}
        {row.source !== 'Manual' && (
          <Box component="span" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {movementSourceLabels[row.source]}
          </Box>
        )}
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row.note || '—'}
        </Box>
      </Stack>
    ),
  },
];

/** «Перекази»: 50 rows per page from the server; sort by date or amount. */
export function FinanceTransfersGrid({ rows, rowCount, onVoid, ...props }: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Перекази"
      rows={rows.map((row) => ({
        ...row,
        name: `${formatLedgerDate(row.date)} ${row.fromAccountName} → ${row.toAccountName}`,
      }))}
      columns={columns}
      loading={props.loading}
      searching={props.searching}
      unavailable={props.unavailable}
      emptyLabel="Переказів поки немає"
      notFoundLabel="За цими фільтрами переказів немає"
      menuLabel="Дії переказу"
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
