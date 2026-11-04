import { formatMeters } from '@admin/production/model';
import { ReferenceDataGrid } from '@admin/references/ui';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Tooltip, Typography } from '@mui/material';

import type { FabricNormRow } from '@admin/production/model';
import type { GridColDef } from '@mui/x-data-grid';

type Row = FabricNormRow & { id: number; name: string };

interface Props {
  rows: FabricNormRow[];
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  onView: (row: FabricNormRow) => void;
  onEdit: (row: FabricNormRow) => void;
  onDelete: (row: FabricNormRow) => void;
}

const meters = (value: number | null) => formatMeters(value);

const columns: GridColDef<Row>[] = [
  { field: 'modelCode', headerName: 'Код', width: 110, cellClassName: 'reference-mono' },
  {
    field: 'modelName',
    headerName: 'Модель',
    flex: 1,
    minWidth: 220,
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        {row.problem && (
          <Tooltip title={row.problem}>
            <ErrorOutlineOutlinedIcon fontSize="small" color="error" aria-label={row.problem} />
          </Tooltip>
        )}
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {row.modelName ?? row.modelCode}
        </Typography>
        {!row.modelIsActive && row.modelName && (
          <Typography variant="caption" color="text.secondary">
            вимкнена
          </Typography>
        )}
      </Box>
    ),
  },
  {
    field: 'oneColor',
    headerName: 'Один колір',
    width: 120,
    cellClassName: 'reference-mono',
    valueGetter: (_value, row) => row.norm?.oneColor ?? null,
    valueFormatter: meters,
  },
  {
    field: 'twoColorsTotal',
    headerName: 'Два кольори',
    width: 190,
    cellClassName: 'reference-mono',
    sortable: false,
    renderCell: ({ row }) =>
      row.norm?.twoColorsMain == null
        ? '—'
        : `${meters(row.norm.twoColorsMain)} + ${meters(row.norm.twoColorsAdditional)}`,
  },
  {
    field: 'threeColorsTotal',
    headerName: 'Три кольори',
    width: 240,
    cellClassName: 'reference-mono',
    sortable: false,
    renderCell: ({ row }) =>
      row.norm?.threeColorsMain == null
        ? '—'
        : [
            row.norm.threeColorsMain,
            row.norm.threeColorsAdditional1,
            row.norm.threeColorsAdditional2,
          ]
            .filter((part) => part !== null)
            .map(meters)
            .join(' + '),
  },
];

/** «Норми витрати тканини»: one row per Catalog sewing model; only problems get a mark. */
export function FabricNormsGrid({ rows, onView, onEdit, onDelete, ...props }: Props) {
  const gridRows: Row[] = rows.map((row, index) => ({
    ...row,
    id: index + 1,
    name: row.modelName ? `${row.modelCode} ${row.modelName}` : row.modelCode,
  }));
  const byId = (id: number) => rows[id - 1];
  return (
    <ReferenceDataGrid
      ariaLabel="Норми витрати тканини"
      rows={gridRows}
      columns={columns}
      emptyLabel="Швейних моделей у «Товари» поки немає"
      notFoundLabel="Моделей не знайдено"
      menuLabel="Дії норми"
      selectable={false}
      selection={{ type: 'include', ids: new Set() }}
      onSelectionChange={() => undefined}
      deleteLabel="Видалити норму"
      onView={(row) => onView(byId(row.id))}
      onEdit={(row) => onEdit(byId(row.id))}
      onDelete={(id) => onDelete(byId(id))}
      {...props}
    />
  );
}
