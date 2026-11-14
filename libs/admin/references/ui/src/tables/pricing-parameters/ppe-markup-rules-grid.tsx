import { formatPercent } from '@admin/references/model';

import { ReferenceDataGrid } from '../reference-list/reference-data-grid';

import type { PpeMarkupRule } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: PpeMarkupRule[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (rule: PpeMarkupRule) => void;
  onEdit: (rule: PpeMarkupRule) => void;
  onDelete: (id: number) => void;
}

const markup = (field: keyof PpeMarkupRule, headerName: string): GridColDef<PpeMarkupRule> => ({
  field,
  headerName,
  width: 120,
  type: 'number',
  cellClassName: 'reference-mono',
  valueFormatter: (value: number) => formatPercent(value),
});

const columns: GridColDef<PpeMarkupRule>[] = [
  {
    field: 'name',
    headerName: 'Правило',
    flex: 1.2,
    minWidth: 220,
    cellClassName: 'reference-strong',
  },
  markup('retailMarkup', 'Роздріб'),
  markup('wholesaleMarkup', 'Опт'),
  markup('largeWholesaleMarkup', 'Великий опт'),
  {
    field: 'priceNote',
    headerName: 'Примітка для прайсу',
    flex: 1,
    minWidth: 180,
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'appliesTo',
    headerName: 'До яких товарів належить',
    flex: 1.4,
    minWidth: 220,
    valueFormatter: (value: string | null) => value || '—',
  },
];

export function PpeMarkupRulesGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Націнки ЗІЗ"
      columns={columns}
      emptyLabel="Правил націнки поки немає"
      notFoundLabel="Правил не знайдено"
      menuLabel="Дії правила"
      {...props}
    />
  );
}
