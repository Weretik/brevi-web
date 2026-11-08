import { useGetQuoteFabricFactsQuery } from '@admin/quotes/data-access';
import { quoteDraftFabricIds } from '@admin/quotes/model';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

import type { QuoteDraft, QuoteFabricFacts } from '@admin/quotes/model';

const none: ReadonlyMap<number, QuoteFabricFacts> = new Map();

/** The manager line of every fabric in the КП (R-31), loaded in one request and refreshed when a fabric is added. */
export function useQuoteFabricFacts(draft: QuoteDraft): ReadonlyMap<number, QuoteFabricFacts> {
  const ids = quoteDraftFabricIds(draft);
  const key = ids.join(',');
  const stableIds = useMemo(() => (key ? key.split(',').map(Number) : []), [key]);
  const { data } = useGetQuoteFabricFactsQuery(stableIds.length > 0 ? stableIds : skipToken);
  return useMemo(
    () => (data ? new Map(data.map((fabric) => [fabric.fabricId, fabric])) : none),
    [data],
  );
}
