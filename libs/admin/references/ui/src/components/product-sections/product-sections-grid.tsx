import { productSectionTypeLabels } from '@admin/references/model';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';

import type { ProductSection, ProductSectionType } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: ProductSection[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (section: ProductSection) => void;
  onEdit: (section: ProductSection) => void;
  onDelete: (id: number) => void;
}

const columns: GridColDef<ProductSection>[] = [
  {
    field: 'name',
    headerName: 'Розділ',
    flex: 1,
    minWidth: 220,
    cellClassName: 'reference-strong',
  },
  {
    field: 'type',
    headerName: 'Тип товару',
    width: 180,
    valueFormatter: (value: ProductSectionType) => productSectionTypeLabels[value],
  },
  {
    field: 'isActive',
    headerName: 'Статус',
    width: 130,
    renderCell: ({ value }) => (
      <ReferenceStatusPill
        active={Boolean(value)}
        activeLabel="Активний"
        inactiveLabel="Вимкнений"
      />
    ),
  },
  {
    field: 'comment',
    headerName: 'Коментар',
    flex: 1.4,
    minWidth: 220,
    valueFormatter: (value: string | null) => value || '—',
  },
];

export function ProductSectionsGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Типи і розділи"
      columns={columns}
      emptyLabel="Розділів поки немає"
      notFoundLabel="Розділів не знайдено"
      menuLabel="Дії розділу"
      {...props}
    />
  );
}
