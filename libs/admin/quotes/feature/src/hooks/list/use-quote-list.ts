import { useListQuotesQuery } from '@admin/quotes/data-access';
import { useDeferredValue, useState } from 'react';

import type { GridPaginationModel } from '@mui/x-data-grid';

/** «КП» list state: search, responsible filter (Director/Admin) and the server page. */
export function useQuoteList() {
  const [archived, setArchivedTab] = useState(false);
  const [search, setSearchText] = useState('');
  const [responsibleUserId, setResponsible] = useState<number | null>(null);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const deferredSearch = useDeferredValue(search);

  const query = useListQuotesQuery({
    archived,
    search: deferredSearch,
    responsibleUserId,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
  });

  return {
    archived,
    setArchived: (value: boolean) => {
      setArchivedTab(value);
      setPagination((current) => ({ ...current, page: 0 }));
    },
    search,
    setSearch: (value: string) => {
      setSearchText(value);
      setPagination((current) => ({ ...current, page: 0 }));
    },
    responsibleUserId,
    setResponsible: (value: number | null) => {
      setResponsible(value);
      setPagination((current) => ({ ...current, page: 0 }));
    },
    pagination,
    setPagination,
    page: query.data,
    loading: query.isFetching,
    error: query.isError
      ? ((query.error as { message?: string }).message ?? 'Не вдалося завантажити КП.')
      : null,
    retry: () => void query.refetch(),
    narrowed: Boolean(deferredSearch.trim()) || responsibleUserId !== null,
  };
}
