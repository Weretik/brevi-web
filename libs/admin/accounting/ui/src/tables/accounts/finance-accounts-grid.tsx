import { financeAccountTypeLabels, formatMinor } from '@admin/accounting/model';
import { ReferenceDataGrid } from '@admin/references/ui';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceAccount, FinanceAccountType } from '@admin/accounting/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: FinanceAccount[];
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  onView: (account: FinanceAccount) => void;
  onEdit: (account: FinanceAccount) => void;
  onDelete: (id: string) => void;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

const columns: GridColDef<FinanceAccount>[] = [
  {
    field: 'name',
    headerName: 'Рахунок',
    flex: 1,
    minWidth: 200,
    cellClassName: 'reference-strong',
  },
  {
    field: 'type',
    headerName: 'Тип',
    width: 190,
    valueFormatter: (value: FinanceAccountType) => financeAccountTypeLabels[value],
  },
  {
    field: 'iban',
    headerName: 'IBAN',
    flex: 1,
    minWidth: 240,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string) => value || '—',
  },
  {
    field: 'currentBalance',
    headerName: 'Поточний залишок',
    width: 200,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    sortable: false,
    renderCell: ({ row }) =>
      row.balance?.currentMinor !== null && row.balance?.currentMinor !== undefined ? (
        formatMinor(row.balance.currentMinor, row.currency)
      ) : (
        <FinanceProblemPill label="Не підтверджено" />
      ),
  },
  {
    field: 'legacyBalance',
    headerName: 'Домашня бухгалтерія',
    width: 200,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    sortable: false,
    valueGetter: (_: unknown, row: FinanceAccount) => row.balance?.legacyMinor ?? row.openingMinor,
    valueFormatter: (value: number, row: FinanceAccount) => formatMinor(value, row.currency),
  },
];

/** «Рахунки і каси»: a row opens the side panel; archived rows are on their own chip. */
export function FinanceAccountsGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Рахунки і каси"
      columns={columns}
      emptyLabel="Рахунків поки немає"
      notFoundLabel="Рахунків не знайдено"
      menuLabel="Дії рахунку"
      selectable={false}
      selection={noSelection}
      onSelectionChange={() => undefined}
      {...props}
    />
  );
}
