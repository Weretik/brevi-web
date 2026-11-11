import { dueState, formatDay, orderModelsText, orderStageSpread } from '@admin/production/model';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ProductionOrderStatusPill } from './production-order-status';
import { ProductionStagePill } from '../tracking/production-stage-pill';

import type { ProductionOrderSort, ProductionOrderSummary } from '@admin/production/model';
import type { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
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

const sortFields = { number: 'number', nearestDueDate: 'due', orderDate: 'created' } as const;
type SortField = keyof typeof sortFields;

function toSortModel(sort: ProductionOrderSort | undefined): GridSortModel {
  if (!sort) return [];
  const key = sort.replace('-', '');
  const field = (Object.keys(sortFields) as SortField[]).find((x) => sortFields[x] === key);
  return field ? [{ field, sort: sort.startsWith('-') ? 'desc' : 'asc' }] : [];
}

function fromSortModel(model: GridSortModel): ProductionOrderSort {
  const first = model[0];
  if (!first || !(first.field in sortFields)) return '-number';
  const key = sortFields[first.field as SortField];
  return (first.sort === 'desc' ? `-${key}` : key) as ProductionOrderSort;
}

/** Nine stage marks: done ones graphite, the order's stage orange, the rest empty. */
function StageSteps({ index, total }: { index: number; total: number }) {
  return (
    <Box component="span" aria-hidden sx={{ display: 'inline-flex', gap: '3px' }}>
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            width: 10,
            height: 5,
            borderRadius: '2px',
            bgcolor: i < index ? 'text.primary' : i === index ? 'primary.main' : 'divider',
          }}
        />
      ))}
    </Box>
  );
}

function StageCell({ row }: { row: ProductionOrderSummary }) {
  if (row.status !== 'New') return <ProductionOrderStatusPill status={row.status} />;
  const spread = orderStageSpread(row.stage, row.items);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
      <ProductionStagePill stage={row.stage} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StageSteps index={spread.index} total={spread.total} />
        {spread.ahead > 0 && (
          <Typography component="span" variant="caption" color="text.secondary" noWrap>
            {spread.ahead} з {spread.itemsCount} далі
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function ShippedCell({ row }: { row: ProductionOrderSummary }) {
  const share = row.totalQuantity > 0 ? Math.min(1, row.shippedQuantity / row.totalQuantity) : 0;
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      aria-label={`Відвантажено ${row.shippedQuantity} з ${row.totalQuantity} шт.`}
    >
      <Box
        aria-hidden
        sx={{ width: 48, height: 5, borderRadius: 3, bgcolor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ width: `${share * 100}%`, height: '100%', bgcolor: 'text.primary' }} />
      </Box>
      <Box component="span" className="order-mono">
        {row.shippedQuantity} / {row.totalQuantity}
      </Box>
    </Box>
  );
}

function DueCell({ row, today }: { row: ProductionOrderSummary; today: string }) {
  const due = dueState(row, today);
  return (
    <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.3 }}>
      <Box component="span" className="order-mono">
        {formatDay(row.nearestDueDate)}
      </Box>
      {due?.kind === 'overdue' && (
        <Typography component="span" variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
          Прострочено {due.days} дн.
        </Typography>
      )}
      {due?.kind === 'soon' && (
        <Typography
          component="span"
          variant="caption"
          color="warning.main"
          sx={{ fontWeight: 600 }}
        >
          {due.days === 0 ? 'Сьогодні' : `Через ${due.days} дн.`}
        </Typography>
      )}
    </Box>
  );
}

const columns = (today: string, sortable: boolean): GridColDef<ProductionOrderSummary>[] => [
  {
    field: 'number',
    headerName: '№',
    width: 76,
    sortable,
    cellClassName: 'order-mono',
  },
  {
    field: 'clientName',
    headerName: 'Клієнт і моделі',
    flex: 1.6,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) => {
      const models = orderModelsText(row.items);
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.35 }}>
          <Box component="span" sx={{ fontWeight: 600 }} className="order-ellipsis">
            {row.clientName}
          </Box>
          {models && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              className="order-ellipsis"
              title={models}
            >
              {models}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: 'stage',
    headerName: 'Етап',
    width: 230,
    sortable: false,
    renderCell: ({ row }) => <StageCell row={row} />,
  },
  {
    field: 'shippedQuantity',
    headerName: 'Відвантажено, шт.',
    width: 150,
    sortable: false,
    renderCell: ({ row }) => <ShippedCell row={row} />,
  },
  {
    field: 'nearestDueDate',
    headerName: 'Готово до',
    width: 150,
    sortable,
    renderCell: ({ row }) => <DueCell row={row} today={today} />,
  },
  {
    field: 'quoteNumber',
    headerName: 'КП',
    width: 120,
    sortable: false,
    cellClassName: 'order-mono',
    valueGetter: (_value, row) => row.quoteNumber ?? '',
  },
  { field: 'managerName', headerName: 'Менеджер', flex: 0.8, minWidth: 150, sortable: false },
  {
    field: 'orderDate',
    headerName: 'Створено',
    width: 116,
    sortable,
    cellClassName: 'order-mono',
    valueFormatter: (value: string) => formatDay(value),
  },
];

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
          columns={columns(today, sortable)}
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
