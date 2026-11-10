import { fabricNormModelCaption, formatMeters } from '@admin/production/model';
import { ReferenceDataGrid } from '@admin/references/ui';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Tooltip, Typography } from '@mui/material';

import type { FabricNormRow, FabricNormValues } from '@admin/production/model';
import type { GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

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

/** A metres column of one norm value; «—» when the value is not set. */
const metres = (
  field: string,
  headerName: string,
  value: (row: Row) => number | null,
  strong = false,
): GridColDef<Row> => ({
  field,
  headerName,
  width: strong ? 92 : 104,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  cellClassName: strong ? 'reference-mono reference-strong' : 'reference-mono',
  valueGetter: (_value, row) => value(row),
  valueFormatter: (value: number | null) => formatMeters(value),
});

const norm = (row: Row, field: keyof FabricNormValues) => row.norm?.[field] ?? null;

const columns: GridColDef<Row>[] = [
  {
    field: 'modelName',
    headerName: 'Модель',
    flex: 1,
    minWidth: 240,
    valueGetter: (_value, row) => row.modelName ?? row.modelCode,
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, height: '100%' }}>
        {row.problem && (
          <Tooltip title={row.problem}>
            <ErrorOutlineOutlinedIcon fontSize="small" color="error" aria-label={row.problem} />
          </Tooltip>
        )}
        <Box sx={{ minWidth: 0, lineHeight: 1.3 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {row.modelName ?? row.modelCode}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            {fabricNormModelCaption(row)}
            {!row.modelIsActive && row.modelName ? ' · вимкнена' : ''}
          </Typography>
        </Box>
      </Box>
    ),
  },
  metres('oneColor', 'Верх', (row) => norm(row, 'oneColor')),
  metres('twoColorsMain', 'Основна', (row) => norm(row, 'twoColorsMain')),
  metres('twoColorsAdditional', 'Додаткова', (row) => norm(row, 'twoColorsAdditional')),
  metres('twoColorsTotal', 'Разом', (row) => row.twoColorsTotal, true),
  metres('threeColorsMain', 'Основна', (row) => norm(row, 'threeColorsMain')),
  metres('threeColorsAdditional1', 'Додаткова 1', (row) => norm(row, 'threeColorsAdditional1')),
  metres('threeColorsAdditional2', 'Додаткова 2', (row) => norm(row, 'threeColorsAdditional2')),
  metres('threeColorsTotal', 'Разом', (row) => row.threeColorsTotal, true),
];

/** The column groups of the old «Цех» table «Витрата тканини за моделями». */
const groups: GridColumnGroupingModel = [
  { groupId: 'one', headerName: '1 колір', children: [{ field: 'oneColor' }] },
  {
    groupId: 'two',
    headerName: '2 кольори',
    children: [
      { field: 'twoColorsMain' },
      { field: 'twoColorsAdditional' },
      { field: 'twoColorsTotal' },
    ],
  },
  {
    groupId: 'three',
    headerName: '3 кольори',
    children: [
      { field: 'threeColorsMain' },
      { field: 'threeColorsAdditional1' },
      { field: 'threeColorsAdditional2' },
      { field: 'threeColorsTotal' },
    ],
  },
];

/**
 * «Норми тканини»: one row per Catalog sewing model, the model with «MOD-025 · Літо» under it, then
 * metres per item for one, two and three colours with their totals. Only problems get a mark.
 */
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
      columnGroupingModel={groups}
      rowHeight={60}
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
