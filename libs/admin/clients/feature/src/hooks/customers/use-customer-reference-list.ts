import { useListCustomersQuery } from '@admin/clients/data-access';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ReferenceActivityFilter } from '@admin/references/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

const activities: readonly ReferenceActivityFilter[] = ['active', 'inactive', 'all'];
const activeOf = (activity: ReferenceActivityFilter) =>
  activity === 'all' ? undefined : activity === 'active';

/**
 * Server-side list state of the clients tab, kept in the URL (`search`, `active`, `page`,
 * `pageSize`) next to `tab=clients`. Search is sent 300 ms after typing stops.
 */
export function useCustomerReferenceList() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const rawActivity = params.get('active') as ReferenceActivityFilter | null;
  const activity = rawActivity && activities.includes(rawActivity) ? rawActivity : 'active';
  const rawPage = Number(params.get('page') ?? '1');
  const page = Number.isInteger(rawPage) && rawPage > 0 && rawPage <= 1_000_000 ? rawPage : 1;
  const rawSize = Number(params.get('pageSize') ?? '25');
  const pageSize = [25, 50, 100].includes(rawSize) ? rawSize : 25;
  const [term, setTerm] = useState(search);

  const update = useCallback(
    (changes: Record<string, string | null>) =>
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  useEffect(() => setTerm(search), [search]);
  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed === search) return;
    const timer = setTimeout(() => update({ search: trimmed, page: null }), 300);
    return () => clearTimeout(timer);
  }, [term, search, update]);

  const list = useListCustomersQuery({ search, active: activeOf(activity), page, pageSize });
  const count = (value: ReferenceActivityFilter) => ({
    search,
    active: activeOf(value),
    page: 1,
    pageSize: 1,
  });
  const activeCount = useListCustomersQuery(count('active'));
  const inactiveCount = useListCustomersQuery(count('inactive'));
  const allCount = useListCustomersQuery(count('all'));

  return {
    term,
    setTerm,
    search,
    activity,
    setActivity: (value: ReferenceActivityFilter) =>
      update({ active: value === 'active' ? null : value, page: null }),
    counts: {
      active: activeCount.currentData?.total ?? 0,
      inactive: inactiveCount.currentData?.total ?? 0,
      all: allCount.currentData?.total ?? 0,
    },
    list,
    setPage: ({ page: next, pageSize: size }: GridPaginationModel) =>
      update({
        page: next === 0 ? null : String(next + 1),
        pageSize: size === 25 ? null : String(size),
      }),
  };
}
