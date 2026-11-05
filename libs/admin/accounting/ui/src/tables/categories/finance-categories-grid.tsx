import { ReferenceDataGrid } from '@admin/references/ui';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import { Box } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceCategoryRow } from '@admin/accounting/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: FinanceCategoryRow[];
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  onView: (category: FinanceCategoryRow) => void;
  onEdit: (category: FinanceCategoryRow) => void;
  onDelete: (id: string) => void;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

const columns: GridColDef<FinanceCategoryRow>[] = [
  {
    field: 'name',
    headerName: 'Категорія',
    flex: 1,
    minWidth: 240,
    renderCell: ({ row }) => (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        {row.level === 0 ? (
          <Box component="span" sx={{ fontWeight: 600 }}>
            {row.name}
          </Box>
        ) : (
          <Box
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, pl: 2 }}
          >
            <SubdirectoryArrowRightOutlinedIcon fontSize="small" color="action" aria-hidden />
            {row.name}
          </Box>
        )}
        {!row.active && <FinanceProblemPill label="Вимкнена" />}
      </Box>
    ),
  },
  {
    field: 'childCount',
    headerName: 'Підкатегорій',
    width: 140,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    valueFormatter: (value: number, row) => (row.level === 0 ? String(value) : ''),
  },
  {
    field: 'note',
    headerName: 'Примітка',
    flex: 1.2,
    minWidth: 220,
    valueFormatter: (value: string) => value || '—',
  },
];

/** «Категорії»: each root with its subcategories right under it; the order carries meaning. */
export function FinanceCategoriesGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Категорії"
      columns={columns}
      emptyLabel="Категорій поки немає"
      notFoundLabel="Категорій не знайдено"
      menuLabel="Дії категорії"
      selectable={false}
      sortable={false}
      selection={noSelection}
      onSelectionChange={() => undefined}
      {...props}
    />
  );
}
