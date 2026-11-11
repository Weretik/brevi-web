import { useGetProductionModelSummaryQuery } from '@admin/production/data-access';
import { defaultModelSummarySort, sortModelSummary } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';

import type { ModelSummarySortLevel, ProductionOrderListQuery } from '@admin/production/model';

/** «Зведення за моделями» of the list filters (all pages) and its «Сортування за пріоритетом». */
export function useProductionModelSummary(query: ProductionOrderListQuery, active: boolean) {
  const [sort, setSort] = useState<ModelSummarySortLevel[]>(defaultModelSummarySort);
  const result = useGetProductionModelSummaryQuery({ ...query, page: 1 }, { skip: !active });
  const data = result.data;
  const rows = useMemo(() => (data ? sortModelSummary(data.rows, sort) : []), [data, sort]);

  return {
    sort,
    setSort,
    rows,
    totalQuantity: data?.totalQuantity ?? 0,
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити зведення.')
      : null,
    reload: result.refetch,
  };
}
