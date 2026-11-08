import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { QuoteStatusPill } from '../components/editor/quote-status-pill';

import type { QuoteSummary } from '@admin/quotes/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly QuoteSummary[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  /** The client card: a «Стан» column (draft or sent). */
  withStatus?: boolean;
  /** Text of an empty list instead of the «КП» page wording. */
  emptyLabel?: string;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (row: QuoteSummary) => void;
  /** «Видалити КП» in each row; only for who may delete (the Director for now). */
  onDelete?: (row: QuoteSummary) => void;
}

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

const statusColumn: GridColDef<QuoteSummary> = {
  field: 'status',
  headerName: 'Стан',
  width: 170,
  renderCell: ({ row }) => <QuoteStatusPill status={row.status} lastSentAt={row.lastSentAt} />,
};

const deleteColumn = (onDelete: (row: QuoteSummary) => void): GridColDef<QuoteSummary> => ({
  field: 'actions',
  headerName: '',
  width: 64,
  sortable: false,
  align: 'center',
  renderCell: ({ row }) => (
    <Tooltip title="Видалити КП">
      <IconButton
        size="small"
        aria-label={`Видалити КП ${row.number}`}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(row);
        }}
      >
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
});

const columns: GridColDef<QuoteSummary>[] = [
  { field: 'number', headerName: 'Номер', width: 120, cellClassName: 'quote-mono' },
  { field: 'internalName', headerName: 'Клієнт / запит', flex: 1.4, minWidth: 200 },
  {
    field: 'kind',
    headerName: 'Вид',
    width: 130,
    valueGetter: (_value, row) => (row.kind === 'Introduction' ? 'Для знайомства' : 'Під запит'),
  },
  {
    field: 'companyName',
    headerName: 'Підприємство',
    flex: 1,
    minWidth: 160,
    valueGetter: (_value, row) => row.companyName ?? '',
  },
  {
    field: 'responsible',
    headerName: 'Відповідальний',
    flex: 0.8,
    minWidth: 150,
    valueGetter: (_value, row) => row.responsible.name,
  },
  {
    field: 'itemsCount',
    headerName: 'Позицій',
    width: 100,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'quote-mono',
  },
  {
    field: 'updatedAt',
    headerName: 'Змінено',
    width: 150,
    cellClassName: 'quote-mono',
    valueFormatter: (value: string) => dateFormat.format(new Date(value)),
  },
];

/** «КП» list: one page from the server, newest change first; a row opens the editor. */
export function QuotesTable({
  rows,
  rowCount,
  loading,
  searching,
  withStatus = false,
  emptyLabel,
  paginationModel,
  onPaginationModelChange,
  onOpen,
  onDelete,
}: Props) {
  const shown = [
    ...columns,
    ...(withStatus ? [statusColumn] : []),
    ...(onDelete ? [deleteColumn(onDelete)] : []),
  ];
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Комерційні пропозиції"
          rows={rows as QuoteSummary[]}
          columns={shown}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          sortingMode="server"
          disableColumnSorting
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          onRowClick={({ row }) => onOpen(row)}
          localeText={{
            noRowsLabel: emptyLabel
              ? emptyLabel
              : searching
                ? 'Нічого не знайдено'
                : 'Ще немає жодної КП',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .quote-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </Paper>
  );
}
