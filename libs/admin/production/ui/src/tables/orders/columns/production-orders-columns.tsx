import { formatDay, orderModelsText } from '@admin/production/model';
import { Box, Typography } from '@mui/material';

import { DueCell, ShippedCell, StageCell } from './production-order-cells';

import type { ProductionOrderSummary } from '@admin/production/model';
import type { GridColDef } from '@mui/x-data-grid';

/** The columns of «Виробничі завдання»; `sortable` turns on the server-sorted ones. */
export const productionOrdersColumns = (
  today: string,
  sortable: boolean,
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
