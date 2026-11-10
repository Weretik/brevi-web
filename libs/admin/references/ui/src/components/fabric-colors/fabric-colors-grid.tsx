import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';

import type { FabricColor } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: FabricColor[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (color: FabricColor) => void;
  onEdit: (color: FabricColor) => void;
  onDelete: (id: number) => void;
}

const columns: GridColDef<FabricColor>[] = [
  {
    field: 'sortOrder',
    headerName: '№',
    width: 80,
    cellClassName: 'reference-mono',
  },
  {
    field: 'name',
    headerName: 'Колір',
    flex: 1,
    minWidth: 240,
    cellClassName: 'reference-strong',
  },
  {
    field: 'isActive',
    headerName: 'Статус',
    width: 140,
    renderCell: ({ value }) => (
      <ReferenceStatusPill
        active={Boolean(value)}
        activeLabel="Активний"
        inactiveLabel="Вимкнений"
      />
    ),
  },
];

export function FabricColorsGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Кольори"
      columns={columns}
      emptyLabel="Кольорів поки немає"
      notFoundLabel="Кольорів не знайдено"
      menuLabel="Дії кольору"
      {...props}
    />
  );
}
