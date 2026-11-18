import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { columns, deleteColumn, statusColumn } from './quotes-table.columns';

import type { QuoteSummary } from '@admin/quotes/model';
import type { GridPaginationModel } from '@mui/x-data-grid';
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
