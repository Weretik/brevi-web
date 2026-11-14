import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { productionOrdersColumns } from './columns/production-orders-columns';
import { fromSortModel, toSortModel } from './columns/production-orders-sort';

import type { ProductionOrderSort, ProductionOrderSummary } from '@admin/production/model';
import type { GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  rows: readonly ProductionOrderSummary[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  /** yyyy-mm-dd: a «Нове» order with an earlier due date is overdue. */
  today: string;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (row: ProductionOrderSummary) => void;
  /** Server sort; without it the columns do not sort and the server order is kept. */
  sort?: ProductionOrderSort;
  onSortChange?: (sort: ProductionOrderSort) => void;
}

/**
 * «Виробничі завдання»: one page from the server; a row shows the client with its models, how far the items went,
 * the shipped pieces and the nearest due date, marked only when overdue or due within three days.
 */
export function ProductionOrdersGrid({
  rows,
  rowCount,
  loading,
  searching,
  today,
  paginationModel,
  onPaginationModelChange,
  onOpen,
  sort,
  onSortChange,
}: Props) {
  const sortable = Boolean(onSortChange);
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Виробничі завдання"
          rows={rows as ProductionOrderSummary[]}
          columns={productionOrdersColumns(today, sortable)}
          loading={loading}
          rowCount={rowCount}
          rowHeight={64}
          paginationMode="server"
          sortingMode="server"
          disableColumnSorting={!sortable}
          sortingOrder={['asc', 'desc']}
          sortModel={toSortModel(sort)}
          onSortModelChange={(model) => onSortChange?.(fromSortModel(model))}
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          onRowClick={({ row }) => onOpen(row)}
          localeText={{
            noRowsLabel: searching ? 'Завдань не знайдено' : 'Завдань поки немає',
            paginationRowsPerPage: 'Рядків на сторінці',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .order-mono': {
              fontFamily: 'var(--admin-font-mono)',
              fontVariantNumeric: 'tabular-nums',
            },
            '& .order-ellipsis': {
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </Paper>
  );
}
