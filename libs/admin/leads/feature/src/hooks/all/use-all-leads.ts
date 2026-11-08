import { useListLeadsQuery } from '@admin/leads/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useDeferredValue, useState } from 'react';

import type { LeadScope } from '@admin/leads/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

/** «Усі ліди»: search, «Мої / Вільні / Усі» and the server page. Managers open it to take free leads. */
export function useAllLeads(initialScope: LeadScope) {
  const [search, setSearchText] = useState('');
  const [scope, setScopeValue] = useState<LeadScope>(initialScope);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const deferredSearch = useDeferredValue(search);
  const firstPage = () => setPagination((current) => ({ ...current, page: 0 }));

  const query = useListLeadsQuery({
    search: deferredSearch,
    scope,
    category: null,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
  });

  return {
    search,
    setSearch: (value: string) => {
      setSearchText(value);
      firstPage();
    },
    scope,
    setScope: (value: LeadScope) => {
      setScopeValue(value);
      firstPage();
    },
    pagination,
    setPagination,
    page: query.data,
    loading: query.isFetching,
    error: query.isError ? adminApiErrorMessage(query.error, 'Не вдалося завантажити ліди.') : null,
    retry: () => void query.refetch(),
    narrowed: Boolean(deferredSearch.trim()),
  };
}
