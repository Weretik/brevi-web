import { formatDay } from '@admin/production/model';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ProductionOrderStatusPill } from './production-order-status';

import type { ProductionOrderSummary } from '@admin/production/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
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
}

const isOverdue = (row: ProductionOrderSummary, today: string) =>
  row.status === 'New' && row.nearestDueDate !== null && row.nearestDueDate < today;

const columns = (today: string): GridColDef<ProductionOrderSummary>[] => [
  {
    field: 'number',
    headerName: '№',
    width: 80,
    cellClassName: 'order-mono',
  },
  {
    field: 'status',
    headerName: 'Статус',
    width: 130,
    renderCell: ({ row }) => <ProductionOrderStatusPill status={row.status} />,
  },
  {
    field: 'clientName',
    headerName: 'Клієнт',
    flex: 1.4,
    minWidth: 220,
    cellClassName: 'order-strong',
  },
  {
    field: 'quoteNumber',
    headerName: 'КП',
    width: 130,
    cellClassName: 'order-mono',
    valueGetter: (_value, row) => row.quoteNumber ?? '',
  },
  { field: 'managerName', headerName: 'Менеджер', flex: 0.8, minWidth: 150 },
  {
    field: 'itemsCount',
    headerName: 'Позицій / шт.',
    width: 130,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'order-mono',
    valueGetter: (_value, row) => `${row.itemsCount} / ${row.totalQuantity}`,
  },
  {
    field: 'nearestDueDate',
    headerName: 'Готово до',
    width: 150,
    renderCell: ({ row }) => (
      <Box
        component="span"
        sx={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.3 }}
      >
        <Box component="span" className="order-mono">
          {formatDay(row.nearestDueDate)}
        </Box>
        {isOverdue(row, today) && (
          <Typography component="span" variant="caption" color="error.main">
            Прострочено
          </Typography>
        )}
      </Box>
    ),
  },
  {
    field: 'orderDate',
    headerName: 'Створено',
    width: 120,
    cellClassName: 'order-mono',
    valueFormatter: (value: string) => formatDay(value),
  },
];

/** «Виробничі завдання»: one page from the server, newest number first; a row opens the order. */
export function ProductionOrdersGrid({
  rows,
  rowCount,
  loading,
  searching,
  today,
  paginationModel,
  onPaginationModelChange,
  onOpen,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 'var(--admin-table-height)' }}>
        <DataGrid
          aria-label="Виробничі завдання"
          rows={rows as ProductionOrderSummary[]}
          columns={columns(today)}
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
            '& .order-strong': { fontWeight: 600 },
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
          }}
        />
      </Box>
    </Paper>
  );
}
