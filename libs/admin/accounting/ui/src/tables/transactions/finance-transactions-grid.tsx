import { formatLedgerDate } from '@admin/accounting/model';
import { ReferenceDataGrid } from '@admin/references/ui';

import {
  financeTransactionColumns,
  signedTransactionAmount,
} from './finance-transactions-grid.columns';

import type { FinanceTransaction } from '@admin/accounting/model';
import type { GridPaginationModel, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';

interface Props {
  rows: FinanceTransaction[];
  rowCount: number;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onView: (transaction: FinanceTransaction) => void;
  onEdit: (transaction: FinanceTransaction) => void;
  onVoid: (id: string) => void;
  /** The menu action that calls `onVoid`; «Анулювати» by default. */
  actionLabel?: string;
  ariaLabel?: string;
  emptyLabel?: string;
}

const noSelection: GridRowSelectionModel = { type: 'include', ids: new Set() };

/** «Операції»: 50 rows per page from the server; sort by date or amount. */
export function FinanceTransactionsGrid({
  rows,
  rowCount,
  onVoid,
  actionLabel = 'Анулювати',
  ariaLabel = 'Операції',
  emptyLabel = 'Операцій поки немає',
  ...props
}: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel={ariaLabel}
      rows={rows.map((row) => ({
        ...row,
        name: `${formatLedgerDate(row.date)} ${signedTransactionAmount(row)}`,
      }))}
      columns={financeTransactionColumns}
      loading={props.loading}
      searching={props.searching}
      unavailable={props.unavailable}
      emptyLabel={emptyLabel}
      notFoundLabel="За цими фільтрами операцій немає"
      menuLabel="Дії операції"
      selectable={false}
      selection={noSelection}
      onSelectionChange={() => undefined}
      onView={props.onView}
      onEdit={props.onEdit}
      onDelete={onVoid}
      deleteLabel={actionLabel}
      deleteRight="edit"
      server={{
        rowCount,
        paginationModel: props.paginationModel,
        onPaginationModelChange: props.onPaginationModelChange,
        sortModel: props.sortModel,
        onSortModelChange: props.onSortModelChange,
      }}
    />
  );
}
