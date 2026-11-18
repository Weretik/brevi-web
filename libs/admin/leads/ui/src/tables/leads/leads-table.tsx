import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { leadColumns as columns } from './leads-table.columns';

import type { LeadSummary } from '@admin/leads/model';
import type { GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly LeadSummary[];
  rowCount: number;
  loading: boolean;
  narrowed: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (id: number) => void;
}

/** «Усі ліди»: one server page, overdue first; a row opens the side panel. */
export function LeadsTable({
  rows,
  rowCount,
  loading,
  narrowed,
  paginationModel,
  onPaginationModelChange,
  onOpen,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Ліди"
          rows={rows as LeadSummary[]}
          columns={columns(new Date())}
          loading={loading}
          rowCount={rowCount}
          rowHeight={52}
          paginationMode="server"
          sortingMode="server"
          disableColumnSorting
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          onRowClick={({ row }) => onOpen(row.id)}
          localeText={{
            noRowsLabel: narrowed
              ? 'Нічого не знайдено'
              : 'Лідів ще немає: таблиця синхронізується щоранку',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .lead-mono': {
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
