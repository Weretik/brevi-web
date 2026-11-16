import {
  useGetActivityEntriesQuery,
  useGetActivityFiltersQuery,
} from '@admin/activity-log/data-access';
import {
  activityQueryFromParams,
  activityQueryIsFiltered,
  activityQueryToParams,
} from '@admin/activity-log/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ActivityEntry, ActivityQuery } from '@admin/activity-log/model';

/** R-02: the search waits this long after the last key before it asks the server. */
export const activitySearchDelayMs = 300;

const noOptions = { actors: [], subjectTypes: [], actions: [] };

/** «Журнал дій»: the request kept in the URL, the search pause, the page and the open entry. */
export function useActivityLog() {
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => activityQueryFromParams(params), [params]);
  const [search, setSearch] = useState(query.search ?? '');
  const [openId, setOpenId] = useState<string | null>(null);
  const entries = useGetActivityEntriesQuery(query);
  const filters = useGetActivityFiltersQuery();

  function apply(change: Partial<ActivityQuery>) {
    setParams(activityQueryToParams({ ...query, page: 1, ...change }), { replace: true });
  }

  useEffect(() => {
    const next = search.trim() || undefined;
    if (next === query.search) return;
    const timer = setTimeout(() => apply({ search: next }), activitySearchDelayMs);
    return () => clearTimeout(timer);
    // Only a typed change starts the pause; the query follows the URL.
  }, [search]);

  const items = entries.data?.items ?? [];
  const filtered = activityQueryIsFiltered(query);
  return {
    query,
    search,
    setSearch,
    entries: items,
    total: entries.data?.total ?? 0,
    loading: entries.isFetching,
    error: entries.error
      ? adminApiErrorMessage(entries.error, 'Не вдалося завантажити журнал дій.')
      : null,
    reload: entries.refetch,
    options: filters.data ?? noOptions,
    emptyText: filtered ? 'Нічого не знайдено за цими фільтрами' : 'Записів немає',
    apply,
    setPage: (page: number) =>
      setParams(activityQueryToParams({ ...query, page }), { replace: true }),
    openEntry: items.find((entry) => entry.id === openId) ?? null,
    open: (entry: ActivityEntry) => setOpenId(entry.id),
    close: () => setOpenId(null),
  };
}
