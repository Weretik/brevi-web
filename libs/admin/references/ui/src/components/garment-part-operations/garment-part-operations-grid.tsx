import {
  formatIsoDate,
  formatOperationMinutes,
  formatUah,
  operationLabourCost,
} from '@admin/references/model';
import { useMemo } from 'react';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';

import type { GarmentPartOperation, OperationLabourRates } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: GarmentPartOperation[];
  /** Sewing settings for the cost columns; `null` shows «—». */
  rates: OperationLabourRates | null;
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (operation: GarmentPartOperation) => void;
  onEdit: (operation: GarmentPartOperation) => void;
  onDelete: (id: number) => void;
}

const dash = (value: string | null) => value || '—';

function costColumn(
  field: string,
  headerName: string,
  rates: OperationLabourRates | null,
  pick: 'seamstress' | 'withAssembly',
): GridColDef<GarmentPartOperation> {
  return {
    field,
    headerName,
    width: 128,
    type: 'number',
    sortable: true,
    cellClassName: 'reference-mono',
    valueGetter: (_value, row) => operationLabourCost(row, rates)?.[pick] ?? null,
    valueFormatter: (value: number | null) => (value === null ? '—' : formatUah(value)),
  };
}

function operationColumns(rates: OperationLabourRates | null): GridColDef<GarmentPartOperation>[] {
  return [
    {
      field: 'code',
      headerName: 'Код',
      width: 96,
      cellClassName: 'reference-mono',
      valueFormatter: dash,
    },
    { field: 'garmentPartName', headerName: 'Група', flex: 0.8, minWidth: 150 },
    { field: 'element', headerName: 'Елемент', flex: 0.8, minWidth: 140, valueFormatter: dash },
    { field: 'variant', headerName: 'Варіант', flex: 0.8, minWidth: 140, valueFormatter: dash },
    {
      field: 'name',
      headerName: 'Назва',
      flex: 1.5,
      minWidth: 240,
      cellClassName: 'reference-strong',
    },
    {
      field: 'min',
      headerName: 'Норма',
      width: 96,
      type: 'number',
      cellClassName: 'reference-mono',
      valueFormatter: (_value, row) => formatOperationMinutes(row),
    },
    costColumn('seamstressCost', 'Вартість', rates, 'seamstress'),
    costColumn('assemblyCost', 'Зі збиранням', rates, 'withAssembly'),
    {
      field: 'normCheckedAt',
      headerName: 'Перевірено',
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
}

export function GarmentPartOperationsGrid({ rates, ...props }: Props) {
  const columns = useMemo(() => operationColumns(rates), [rates]);
  return (
    <ReferenceDataGrid
      ariaLabel="Операції"
      columns={columns}
      emptyLabel="Операцій поки немає"
      notFoundLabel="Операцій не знайдено"
      menuLabel="Дії операції"
      {...props}
    />
  );
}
