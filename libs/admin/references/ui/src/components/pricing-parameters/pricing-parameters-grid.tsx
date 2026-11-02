import { formatIsoDate, formatParameterValue } from '@admin/references/model';
import { Stack, Typography } from '@mui/material';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';

import type { PricingParameter } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: PricingParameter[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (parameter: PricingParameter) => void;
  onEdit: (parameter: PricingParameter) => void;
  onDelete: (id: number) => void;
}

const columns: GridColDef<PricingParameter>[] = [
  {
    field: 'name',
    headerName: 'Назва',
    flex: 1.6,
    minWidth: 260,
    renderCell: ({ row }) => (
      <Stack sx={{ justifyContent: 'center', height: '100%', minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ lineHeight: 1.2, fontFamily: 'var(--admin-font-mono)' }}
        >
          {row.code}
        </Typography>
      </Stack>
    ),
  },
  { field: 'group', headerName: 'Група', flex: 1, minWidth: 200 },
  {
    field: 'value',
    headerName: 'Значення',
    width: 170,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    renderCell: ({ row }) => (
      <Stack sx={{ justifyContent: 'center', alignItems: 'flex-end', height: '100%' }}>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
          {formatParameterValue(row.value, row.unit)}
        </Typography>
        {row.isCalculated && (
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
            розраховується
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'updatedOn',
    headerName: 'Дата оновлення',
    width: 140,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string | null) => formatIsoDate(value),
  },
  {
    field: 'comment',
    headerName: 'Коментар',
    flex: 1,
    minWidth: 180,
    valueFormatter: (value: string | null) => value || '—',
  },
];

export function PricingParametersGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Параметри ціноутворення"
      columns={columns}
      emptyLabel="Параметрів поки немає"
      notFoundLabel="Параметрів не знайдено"
      menuLabel="Дії параметра"
      {...props}
    />
  );
}
