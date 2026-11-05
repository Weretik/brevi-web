import { ReferenceDataGrid } from '@admin/references/ui';
import { Stack, Typography } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceCounterparty } from '@admin/accounting/model';
import type { GridColDef, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: FinanceCounterparty[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onView: (counterparty: FinanceCounterparty) => void;
  onEdit: (counterparty: FinanceCounterparty) => void;
  onArchive: (id: string) => void;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

const columns: GridColDef<FinanceCounterparty>[] = [
  {
    field: 'name',
    headerName: 'Контрагент',
    flex: 1,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={{ py: 0.5, gap: 0.5, alignItems: 'flex-start', lineHeight: 1.3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        {row.aliases.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {row.aliases.join(', ')}
          </Typography>
        )}
        {!row.verified && <FinanceProblemPill label="Не підтверджено" />}
        {!row.active && <FinanceProblemPill label="Архів" />}
      </Stack>
    ),
  },
  {
    field: 'edrpou',
    headerName: 'ЄДРПОУ / ІПН',
    width: 160,
    sortable: false,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string) => value || '—',
  },
  {
    field: 'defaultCategoryRootName',
    headerName: 'Категорія',
    width: 220,
    sortable: false,
    valueGetter: (_: unknown, row: FinanceCounterparty) =>
      [row.defaultCategoryRootName, row.defaultSubcategoryName].filter(Boolean).join(' → ') || '—',
  },
  {
    field: 'operationCount',
    headerName: 'Операцій',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    sortable: false,
    cellClassName: 'reference-mono',
  },
];

/** «Контрагенти → Фінансові»: 50 rows per page; a row opens the side panel. */
export function FinanceCounterpartiesGrid({ rowCount, onArchive, ...props }: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Фінансові контрагенти"
      rows={props.rows}
      columns={columns}
      loading={props.loading}
      searching={props.searching}
      unavailable={props.unavailable}
      emptyLabel="Фінансових контрагентів поки немає"
      notFoundLabel="Контрагентів не знайдено"
      menuLabel="Дії контрагента"
      selectable={false}
      selection={noSelection}
      onSelectionChange={() => undefined}
      onView={props.onView}
      onEdit={props.onEdit}
      onDelete={onArchive}
      deleteLabel="Архівувати"
      sortable={false}
      server={{
        rowCount,
        paginationModel: props.paginationModel,
        onPaginationModelChange: props.onPaginationModelChange,
        sortModel: [],
        onSortModelChange: () => undefined,
      }}
    />
  );
}
