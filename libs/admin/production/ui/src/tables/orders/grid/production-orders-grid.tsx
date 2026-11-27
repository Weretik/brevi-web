import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { productionOrdersColumns } from './production-orders-columns';
import { fromSortModel, toSortModel } from './production-orders-sort';

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
  /** The model filter: that model stands first in the models of a row. */
  modelCode?: string | null;
}

/**
 * «Виробничі завдання»: one page from the server; a row shows the models with the client and the stage under them, the
 * applications, fabric and colours, and the nearest due date (the last column), marked only when overdue or due
 * within three days. The shipped pieces are in the tooltip of the models and in the order card.
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
  modelCode = null,
}: Props) {
  const sortable = Boolean(onSortChange);
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Виробничі завдання"
          rows={rows as ProductionOrderSummary[]}
          columns={productionOrdersColumns(today, sortable, modelCode)}
          loading={loading}
          rowCount={rowCount}
          rowHeight={92}
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
