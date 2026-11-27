import { formatDay } from '@admin/production/model';

import { DueCell } from './production-order-cells';
import { ApplicationsCell, FabricColorCell, OrderCell } from './production-order-item-cells';

import type { ProductionOrderSummary } from '@admin/production/model';
import type { GridColDef } from '@mui/x-data-grid';

/**
 * The columns of «Виробничі завдання»; `sortable` turns on the server-sorted ones. «Готово до» is the last one,
 * and `firstModelCode` (the model filter) puts that model first in the models of a row.
 */
export const productionOrdersColumns = (
  today: string,
  sortable: boolean,
  firstModelCode: string | null = null,
): GridColDef<ProductionOrderSummary>[] => [
  {
    field: 'number',
    headerName: '№',
    width: 76,
    sortable,
    cellClassName: 'order-mono',
  },
  {
    field: 'clientName',
    headerName: 'Модель · клієнт · етап',
    flex: 1.8,
    minWidth: 280,
    sortable: false,
    renderCell: ({ row }) => <OrderCell row={row} firstModelCode={firstModelCode} />,
  },
  {
    field: 'applications',
    headerName: 'Нанесення',
    width: 120,
    sortable: false,
    renderCell: ({ row }) => <ApplicationsCell row={row} />,
  },
  {
    field: 'fabric',
    headerName: 'Тканина · колір',
    flex: 1,
    minWidth: 170,
    sortable: false,
    renderCell: ({ row }) => <FabricColorCell row={row} />,
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
  {
    field: 'nearestDueDate',
    headerName: 'Готово до',
    width: 150,
    sortable,
    renderCell: ({ row }) => <DueCell row={row} today={today} />,
  },
];
