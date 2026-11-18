import {
  FinanceCounterpartiesGrid,
  FinancePartiesGrid,
  FinanceTransactionsGrid,
} from '@admin/accounting/ui';
import { Paper } from '@mui/material';

import type { useFinanceCounterpartyList } from '../../hooks/counterparties/use-finance-counterparty-list';
import type {
  FinanceCounterparty,
  FinanceParty,
  FinanceTransaction,
} from '@admin/accounting/model';
import type { ComponentProps } from 'react';

type CounterpartyList = ReturnType<typeof useFinanceCounterpartyList>;
type SharedGrid = Pick<
  ComponentProps<typeof FinanceTransactionsGrid>,
  | 'rowCount'
  | 'loading'
  | 'searching'
  | 'unavailable'
  | 'paginationModel'
  | 'onPaginationModelChange'
>;

const noSort = [{ field: 'date', sort: 'desc' as const }];

/** The grid of the chosen counterparties tab: own counterparties, clients or suppliers, or one-off names. */
export function FinanceCounterpartyTabGrids({
  tab,
  page,
  grid,
  cutoverDate,
  onView,
  onEdit,
  onArchive,
  onOpenParty,
  onReview,
  onPromote,
}: {
  tab: CounterpartyList['tab'];
  page: CounterpartyList['page'];
  grid: SharedGrid;
  cutoverDate: string;
  onView: (counterparty: FinanceCounterparty) => void;
  onEdit: (counterparty: FinanceCounterparty) => void;
  onArchive: (id: string) => void;
  onOpenParty: (party: FinanceParty) => void;
  onReview: (transaction: FinanceTransaction) => void;
  onPromote: (id: string) => void;
}) {
  return (
    <>
      {tab === 'Financial' && (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <FinanceCounterpartiesGrid
            {...grid}
            cutoverDate={cutoverDate}
            rows={page?.financial ?? []}
            onView={onView}
            onEdit={onEdit}
            onArchive={onArchive}
          />
        </Paper>
      )}
      {(tab === 'Clients' || tab === 'Suppliers') && (
        <FinancePartiesGrid
          {...grid}
          cutoverDate={cutoverDate}
          rows={page?.parties ?? []}
          onOpen={onOpenParty}
        />
      )}
      {tab === 'Oneoffs' && (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <FinanceTransactionsGrid
            {...grid}
            ariaLabel="Разові контрагенти"
            emptyLabel="Операцій з разовими назвами немає"
            actionLabel="Зробити постійним"
            rows={page?.oneoffs ?? []}
            sortModel={noSort}
            onSortModelChange={() => undefined}
            onView={onReview}
            onEdit={onReview}
            onVoid={onPromote}
          />
        </Paper>
      )}
    </>
  );
}
