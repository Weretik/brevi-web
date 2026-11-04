import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useGetTaskOverviewQuery, useListTasksQuery } from '@admin/tasks/data-access';
import { useDeferredValue, useState } from 'react';

import type { TaskListFilter } from '@admin/tasks/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

/** «Завдання менеджерам»: search, filter chip, the selected manager and the server page. */
export function useTaskList() {
  const [search, setSearchText] = useState('');
  const [filter, setFilterValue] = useState<TaskListFilter>('Open');
  const [assigneeUserId, setAssigneeValue] = useState<number | null>(null);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const deferredSearch = useDeferredValue(search);
  const firstPage = () => setPagination((current) => ({ ...current, page: 0 }));

  const query = useListTasksQuery({
    search: deferredSearch,
    filter,
    assigneeUserId,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
  });
  // Counts follow the selected manager; the workload list always shows everyone.
  const overview = useGetTaskOverviewQuery({ assigneeUserId });
  const team = useGetTaskOverviewQuery({ assigneeUserId: null });

  return {
    search,
    setSearch: (value: string) => {
      setSearchText(value);
      firstPage();
    },
    filter,
    setFilter: (value: TaskListFilter) => {
      setFilterValue(value);
      firstPage();
    },
    assigneeUserId,
    setAssignee: (value: number | null) => {
      setAssigneeValue(value);
      firstPage();
    },
    pagination,
    setPagination,
    page: query.data,
    overview: overview.data,
    load: team.data?.load ?? [],
    loading: query.isFetching,
    error: query.isError
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити завдання.')
      : null,
    retry: () => {
      void query.refetch();
      void overview.refetch();
    },
    narrowed: Boolean(deferredSearch.trim()) || assigneeUserId !== null,
  };
}
