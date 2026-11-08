import { useGetFinanceTransactionsQuery } from '@admin/accounting/data-access';
import {
  counterpartyFinanceParams,
  counterpartyFinancePeriodProblem,
  emptyCounterpartyFinancePeriod,
} from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { CounterpartyFinancePeriod, LedgerScope } from '@admin/accounting/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

export type CounterpartyFinanceKind = 'Client' | 'Supplier';

const pageSize = 50;

/**
 * «Фінанси» of a client or supplier card: active incomes and expenses with this counterparty, newest first.
 * The period applies on «Показати» and starts again from the first page.
 */
export function useCounterpartyFinance(kind: CounterpartyFinanceKind, id: string) {
  const [scope, setScopeState] = useState<LedgerScope>('Current');
  const [draft, setDraft] = useState<CounterpartyFinancePeriod>(emptyCounterpartyFinancePeriod);
  const [applied, setApplied] = useState<CounterpartyFinancePeriod>(emptyCounterpartyFinancePeriod);
  const [page, setPage] = useState(1);
  const query = useGetFinanceTransactionsQuery(
    counterpartyFinanceParams(kind, id, scope, applied, page),
  );
  const problem = counterpartyFinancePeriodProblem(draft);

  return {
    scope,
    setScope: (next: LedgerScope) => {
      setScopeState(next);
      setPage(1);
    },
    draft,
    setDraft,
    problem,
    apply: () => {
      if (problem) return;
      setApplied(draft);
      setPage(1);
    },
    page: query.data,
    loading: query.isLoading || query.isFetching,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити операції.')
      : null,
    refetch: () => void query.refetch(),
    searching: Boolean(applied.from || applied.to),
    paginationModel: { page: page - 1, pageSize } satisfies GridPaginationModel,
    changePage: (model: GridPaginationModel) => setPage(model.page + 1),
  };
}
