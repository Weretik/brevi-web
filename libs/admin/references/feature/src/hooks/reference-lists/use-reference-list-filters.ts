import { countByActivity } from '@admin/references/model';
import { useMemo, useState } from 'react';

import type { ReferenceActivityFilter, ReferenceSupplierFilter } from '@admin/references/model';

/**
 * Search, activity and optional supplier filter state of a «Цех» reference list, with the
 * counts the filter bar shows. `filter` applies them to the loaded rows.
 */
export function useReferenceListFilters<Row extends { isActive: boolean }>(
  rows: Row[],
  filter: (
    rows: Row[],
    search: string,
    activity: ReferenceActivityFilter,
    supplier: ReferenceSupplierFilter,
  ) => Row[],
) {
  const [search, setSearch] = useState('');
  const [activity, setActivity] = useState<ReferenceActivityFilter>('active');
  const [supplier, setSupplier] = useState<ReferenceSupplierFilter>(null);
  const filteredRows = useMemo(
    () => filter(rows, search, activity, supplier),
    [filter, rows, search, activity, supplier],
  );
  const activityCounts = useMemo(() => countByActivity(rows), [rows]);
  return {
    search,
    setSearch,
    activity,
    setActivity,
    supplier,
    setSupplier,
    filteredRows,
    activityCounts,
    /** Rows of the current activity before search and supplier narrow them. */
    activityTotal: activityCounts[activity],
  };
}
