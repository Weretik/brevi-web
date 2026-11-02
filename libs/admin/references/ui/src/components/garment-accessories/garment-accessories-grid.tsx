import { formatIsoDate, formatUah } from '@admin/references/model';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';

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
}

const columns: GridColDef<GarmentAccessory>[] = [
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
  { field: 'supplierName', headerName: 'Постачальник', flex: 1, minWidth: 180 },
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

export function GarmentAccessoriesGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Фурнітура"
      columns={columns}
      emptyLabel="Фурнітури поки немає"
      notFoundLabel="Фурнітури не знайдено"
      menuLabel="Дії фурнітури"
      {...props}
    />
  );
}
