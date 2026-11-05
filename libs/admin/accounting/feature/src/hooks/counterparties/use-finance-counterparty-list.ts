import { useGetFinanceCounterpartiesQuery } from '@admin/accounting/data-access';
import {
  counterpartyTabOfParam,
  counterpartyTabParam,
  financeCounterpartyParams,
  financeJournalPageSize,
} from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useDeferredValue, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { FinanceCounterpartyTab } from '@admin/accounting/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

/** Tab (`?tab=`), search, «Показати архівні» and page of «Контрагенти». */
export function useFinanceCounterpartyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = counterpartyTabOfParam(searchParams.get('tab'));
  const [search, setSearch] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [page, setPage] = useState(0);
  const deferred = useDeferredValue(search);
  const query = useGetFinanceCounterpartiesQuery(
    financeCounterpartyParams({ tab, search: deferred, includeArchived, page: page + 1 }),
  );

  return {
    tab,
    search,
    includeArchived,
    page: query.data,
    loading: query.isLoading || query.isFetching,
    error: query.error
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити контрагентів.')
      : null,
    paginationModel: { page, pageSize: financeJournalPageSize } satisfies GridPaginationModel,
    refetch: () => void query.refetch(),
    setTab: (next: FinanceCounterpartyTab) => {
      setSearchParams(counterpartyTabParam(next), { replace: true });
      setPage(0);
    },
    setSearch: (text: string) => {
      setSearch(text);
      setPage(0);
    },
    toggleArchived: () => {
      setIncludeArchived((value) => !value);
      setPage(0);
    },
    changePage: (model: GridPaginationModel) => setPage(model.page),
  };
}
