import { formatDay } from '@admin/production/model';
import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { WorkshopArchiveRow } from '@admin/production/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly WorkshopArchiveRow[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (row: WorkshopArchiveRow) => void;
}

const text = (value: string | null) => value ?? '';

const columns: GridColDef<WorkshopArchiveRow>[] = [
  {
    field: 'date',
    headerName: 'Дата',
    width: 120,
    cellClassName: 'archive-mono',
    valueGetter: (_value, row) => (row.date ? formatDay(row.date) : text(row.dateText)),
  },
  {
    field: 'number',
    headerName: '№',
    width: 100,
    cellClassName: 'archive-mono',
    valueGetter: (_value, row) => text(row.number),
  },
  {
    field: 'client',
    headerName: 'Замовник',
    flex: 1.2,
    minWidth: 200,
    cellClassName: 'archive-strong',
    valueGetter: (_value, row) => text(row.client),
  },
  {
    field: 'product',
    headerName: 'Виріб',
    flex: 1.4,
    minWidth: 220,
    valueGetter: (_value, row) => text(row.product),
  },
  {
    field: 'quantity',
    headerName: 'Кількість',
    width: 110,
    cellClassName: 'archive-mono',
    valueGetter: (_value, row) => text(row.quantity),
  },
  {
    field: 'fabric',
    headerName: 'Тканина',
    flex: 1,
    minWidth: 160,
    valueGetter: (_value, row) => text(row.fabric),
  },
];

/** «Архів цеху»: one page of an old book from the server, newest first; a row opens its details. */
export function WorkshopArchiveGrid({
  rows,
  rowCount,
  loading,
  searching,
  paginationModel,
  onPaginationModelChange,
  onOpen,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Архів цеху"
          rows={rows as WorkshopArchiveRow[]}
          columns={columns}
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
            noRowsLabel: searching ? 'Нічого не знайдено' : 'Архів ще не перенесено',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .archive-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .archive-strong': { fontWeight: 600 },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </Paper>
  );
}
