import { useGetFabricConsumptionQuery } from '@admin/warehouse/data-access';
import { filterConsumption, kyivToday, movementPeriodRange } from '@admin/warehouse/model';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../debounce/use-debounced-value';

import type { ConsumptionSortKey, MovementPeriod } from '@admin/warehouse/model';

/** «Звіти › Витрата за період»: the period, the search and the sort of the consumption rows. */
export function useFabricConsumptionReport() {
  const today = kyivToday();
  const [period, setPeriod] = useState<MovementPeriod>('month');
  const [dates, setDates] = useState(() => movementPeriodRange('month', today));
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 200);
  const [sort, setSort] = useState<{ key: ConsumptionSortKey; descending: boolean }>({
    key: 'issuedToTasks',
    descending: true,
  });
  const from = dates.from;
  const to = dates.to;
  const valid = Boolean(from && to && from <= to);
  const report = useGetFabricConsumptionQuery(
    { from: from ?? today, to: to ?? today },
    { skip: !valid },
  );
  const data = valid ? report.data : undefined;
  const rows = useMemo(
    () => (data ? filterConsumption(data.rows, debounced, sort.key, sort.descending) : []),
    [data, debounced, sort],
  );
  const seesValue = data?.issuedValue !== null && data?.issuedValue !== undefined;
  return {
    today,
    period,
    setPeriod,
    setDates,
    search,
    setSearch,
    debounced,
    sort,
    setSort,
    from,
    to,
    valid,
    report,
    data,
    rows,
    seesValue,
  };
}
