import {
  useGetProductionOrdersQuery,
  useGetWorkshopArchiveQuery,
} from '@admin/production/data-access';
import { todayIso } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useDebouncedValue } from '../requests/use-debounced-value';

import type { WorkshopArchiveKind } from '@admin/production/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

/** An old book of the «Цех» or the closed Brevi orders. */
export type WorkshopArchiveView = WorkshopArchiveKind | 'Closed';

/** «Архів цеху»: one book at a time, «Пошук» by every word, dates and server pages. */
export function useWorkshopArchive() {
  const [view, setViewValue] = useState<WorkshopArchiveView>('Schedule');
  const [search, setSearchValue] = useState('');
  const [from, setFromValue] = useState('');
  const [to, setToValue] = useState('');
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const debouncedSearch = useDebouncedValue(search);
  const wrongPeriod = from !== '' && to !== '' && from > to;
  const page = pagination.page + 1;

  const archive = useGetWorkshopArchiveQuery(
    {
      kind: view === 'Closed' ? 'Schedule' : view,
      search: debouncedSearch,
      from: from || undefined,
      to: to || undefined,
      page,
      pageSize: pagination.pageSize,
    },
    { skip: view === 'Closed' || wrongPeriod },
  );
  const closed = useGetProductionOrdersQuery(
    {
      search: debouncedSearch,
      status: 'Closed',
      manager: null,
      dueTo: null,
      stage: null,
      page,
      pageSize: pagination.pageSize,
    },
    { skip: view !== 'Closed' },
  );
  const result = view === 'Closed' ? closed : archive;
  const firstPage = () => setPagination((current) => ({ ...current, page: 0 }));

  return {
    view,
    search,
    from,
    to,
    today: todayIso(),
    wrongPeriod,
    pagination,
    archive: view === 'Closed' ? null : (archive.data ?? null),
    closed: view === 'Closed' ? (closed.data ?? null) : null,
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити архів.')
      : null,
    reload: result.refetch,
    setPagination,
    setView: (value: WorkshopArchiveView) => {
      setViewValue(value);
      firstPage();
    },
    setSearch: (value: string) => {
      setSearchValue(value);
      firstPage();
    },
    setFrom: (value: string) => {
      setFromValue(value);
      firstPage();
    },
    setTo: (value: string) => {
      setToValue(value);
      firstPage();
    },
  };
}
