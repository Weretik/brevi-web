import { formatIsoDate, formatUah } from '@admin/references/model';
import { useMemo } from 'react';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';
import { SupplierNameButton } from '../suppliers/supplier-name-button';

import type { GarmentAccessory } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: GarmentAccessory[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (accessory: GarmentAccessory) => void;
  onEdit: (accessory: GarmentAccessory) => void;
  onDelete: (id: number) => void;
  /** A click on the supplier opens its card (CAT-019). */
  onOpenSupplier?: (name: string) => void;
}

const columns = (onOpenSupplier?: (name: string) => void): GridColDef<GarmentAccessory>[] => [
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
    flex: 1.5,
    minWidth: 220,
    cellClassName: 'reference-strong',
  },
  {
    field: 'supplierName',
    headerName: 'Постачальник',
    flex: 1,
    minWidth: 180,
    renderCell: ({ row, tabIndex }) =>
      onOpenSupplier ? (
        <SupplierNameButton name={row.supplierName} onOpen={onOpenSupplier} tabIndex={tabIndex} />
      ) : (
        row.supplierName || '—'
      ),
  },
  {
    field: 'price',
    headerName: 'Ціна',
    width: 130,
    type: 'number',
    cellClassName: 'reference-mono',
    valueFormatter: (value: number) => formatUah(value),
  },
  { field: 'unit', headerName: 'Одиниця', width: 100 },
  {
    field: 'priceUpdatedAt',
    headerName: 'Дата ціни',
    width: 112,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string | null) => formatIsoDate(value),
  },
  {
    field: 'comment',
    headerName: 'Коментар',
    flex: 1,
    minWidth: 160,
    valueFormatter: (value: string | null) => value || '—',
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

export function GarmentAccessoriesGrid({ onOpenSupplier, ...props }: Props) {
  const gridColumns = useMemo(() => columns(onOpenSupplier), [onOpenSupplier]);
  return (
    <ReferenceDataGrid
      ariaLabel="Фурнітура"
      columns={gridColumns}
      emptyLabel="Фурнітури поки немає"
      notFoundLabel="Фурнітури не знайдено"
      menuLabel="Дії фурнітури"
      {...props}
    />
  );
}
