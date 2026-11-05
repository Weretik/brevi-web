import { formatIsoDate, formatUah } from '@admin/references/model';
import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';
import { SupplierNameButton } from '../suppliers/supplier-name-button';

import type { Fabric } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: Fabric[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (fabric: Fabric) => void;
  onEdit: (fabric: Fabric) => void;
  onDelete: (id: number) => void;
  /** A click on the supplier opens its card (CAT-019). */
  onOpenSupplier?: (name: string) => void;
}

const columns = (onOpenSupplier?: (name: string) => void): GridColDef<Fabric>[] => [
  {
    field: 'code',
    headerName: 'Код',
    width: 104,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'name',
    headerName: 'Назва',
    flex: 1.6,
    minWidth: 240,
    renderCell: ({ row }) => (
      <Stack sx={{ justifyContent: 'center', height: '100%', minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        {row.nameRu && (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ lineHeight: 1.2 }}>
            RU: {row.nameRu}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'providerName',
    headerName: 'Постачальник',
    flex: 1,
    minWidth: 160,
    renderCell: ({ row, tabIndex }) =>
      onOpenSupplier ? (
        <SupplierNameButton name={row.providerName} onOpen={onOpenSupplier} tabIndex={tabIndex} />
      ) : (
        row.providerName || '—'
      ),
  },
  {
    field: 'composition',
    headerName: 'Склад',
    flex: 1,
    minWidth: 170,
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'density',
    headerName: 'Г/м²',
    width: 84,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'price',
    headerName: 'Ціна за 1 м',
    width: 130,
    type: 'number',
    cellClassName: 'reference-mono',
    valueFormatter: (value: number) => formatUah(value),
  },
  {
    field: 'priceUpdatedAt',
    headerName: 'Дата ціни',
    width: 112,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string | null) => formatIsoDate(value),
  },
  {
    field: 'isActive',
    headerName: 'Статус',
    width: 160,
    type: 'boolean',
    align: 'left',
    headerAlign: 'left',
    renderCell: ({ value }) => (
      <ReferenceStatusPill
        active={Boolean(value)}
        activeLabel="Активна"
        inactiveLabel="Не використовується"
      />
    ),
  },
];

export function FabricsGrid({ onOpenSupplier, ...props }: Props) {
  const gridColumns = useMemo(() => columns(onOpenSupplier), [onOpenSupplier]);
  return (
    <ReferenceDataGrid
      ariaLabel="Тканини"
      columns={gridColumns}
      emptyLabel="Тканин поки немає"
      notFoundLabel="Тканин не знайдено"
      menuLabel="Дії тканини"
      {...props}
    />
  );
}
