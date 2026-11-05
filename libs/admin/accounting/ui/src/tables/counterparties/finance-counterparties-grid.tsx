import { ReferenceDataGrid } from '@admin/references/ui';
import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { financeTurnoverColumn } from './finance-turnover-column';
import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceCounterparty } from '@admin/accounting/model';
import type { GridColDef, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  /** The start of the current books, for «Оборот з …». */
  cutoverDate: string;
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

const baseColumns: GridColDef<FinanceCounterparty>[] = [
  {
    field: 'name',
    headerName: 'Контрагент',
    flex: 1,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={{ py: 0.5, lineHeight: 1.3, minWidth: 0 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
          {!row.verified && <FinanceProblemPill label="Не підтверджено" />}
          {!row.active && <FinanceProblemPill label="Архів" />}
        </Stack>
        {row.aliases.length > 0 && (
          <Typography variant="caption" color="text.secondary" noWrap>
            також: {row.aliases.join(', ')}
          </Typography>
        )}
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
    headerName: 'Категорія за замовчуванням',
    width: 240,
    sortable: false,
    valueGetter: (_: unknown, row: FinanceCounterparty) =>
      [row.defaultCategoryRootName, row.defaultSubcategoryName].filter(Boolean).join(' › ') || '—',
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
export function FinanceCounterpartiesGrid({ rowCount, onArchive, cutoverDate, ...props }: Props) {
  const columns = useMemo(
    () => [
      ...baseColumns,
      financeTurnoverColumn<FinanceCounterparty>(cutoverDate, 'reference-mono'),
    ],
    [cutoverDate],
  );
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
