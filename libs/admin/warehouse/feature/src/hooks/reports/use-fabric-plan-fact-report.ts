import { useGetFabricPlanFactQuery } from '@admin/warehouse/data-access';
import { filterPlanFact, planFactDeviation } from '@admin/warehouse/model';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../debounce/use-debounced-value';

import type {
  MovementPeriod,
  PlanFactFilter,
  PlanFactModel,
  PlanFactView,
} from '@admin/warehouse/model';

/** «Звіти › План і факт»: the period, the search, the view chip and the open model. */
export function useFabricPlanFactReport() {
  const [period, setPeriod] = useState<MovementPeriod>('all');
  const [filter, setFilter] = useState<PlanFactFilter>({ from: null, to: null });
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 200);
  const [view, setView] = useState<PlanFactView>('all');
  const [open, setOpen] = useState<PlanFactModel | null>(null);
  const valid = !filter.from || !filter.to || filter.from <= filter.to;
  const report = useGetFabricPlanFactQuery(filter, { skip: !valid });
  const data = report.data;
  const models = useMemo(
    () => (data ? filterPlanFact(data.models, view, debounced) : []),
    [data, view, debounced],
  );
  const total = data?.total;
  const deviation = total ? planFactDeviation(total) : null;
  return {
    period,
    setPeriod,
    filter,
    setFilter,
    search,
    setSearch,
    debounced,
    view,
    setView,
    open,
    setOpen,
    valid,
    report,
    data,
    models,
    total,
    deviation,
  };
}
