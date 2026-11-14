import {
  defaultFabricMovementQuery,
  kyivToday,
  movementFilterOf,
  movementPeriodRange,
  withMovementFilter,
} from '@admin/warehouse/model';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebouncedValue } from '../debounce/use-debounced-value';

import type { FabricMovementQuery, MovementPeriod } from '@admin/warehouse/model';

/**
 * Filters of «Рух тканини»: kind and search start from the address, a typed search applies after a pause, a period
 * sets the dates, and any change starts again from the first page.
 */
export function useMovementFilters() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState<FabricMovementQuery>(() => ({
    ...defaultFabricMovementQuery,
    kind: movementFilterOf(params.get('kind')),
    search: params.get('search')?.trim() ?? '',
  }));
  const [search, setSearch] = useState(() => params.get('search') ?? '');
  const [period, setPeriod] = useState<MovementPeriod>('all');
  const typed = useDebouncedValue(search.trim());
  useEffect(
    () =>
      setQuery((current) =>
        current.search === typed ? current : withMovementFilter(current, { search: typed }),
      ),
    [typed],
  );

  return {
    query,
    search,
    setSearch,
    period,
    choosePeriod: (value: MovementPeriod) => {
      setPeriod(value);
      if (value !== 'custom')
        setQuery((current) => withMovementFilter(current, movementPeriodRange(value, kyivToday())));
    },
    change: (change: Partial<Omit<FabricMovementQuery, 'page'>>) =>
      setQuery((current) => withMovementFilter(current, change)),
    setPage: (page: number) => setQuery((current) => ({ ...current, page })),
    filtered: Boolean(query.search || query.from || query.to || query.kind !== 'All'),
  };
}
