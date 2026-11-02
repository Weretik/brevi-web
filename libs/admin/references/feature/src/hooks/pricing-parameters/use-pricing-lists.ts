import {
  useListPpeMarkupRulesQuery,
  useListPricingParametersQuery,
} from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

import type { PpeMarkupRule, PricingParameter } from '@admin/references/model';

interface ListState<Row> {
  rows: Row[];
  loading: boolean;
  error: string | null;
  reload: () => unknown;
}

export function usePricingParameters(): ListState<PricingParameter> {
  const result = useListPricingParametersQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити параметри.')
      : null,
    reload: result.refetch,
  };
}

export function usePpeMarkupRules(): ListState<PpeMarkupRule> {
  const result = useListPpeMarkupRulesQuery();
  return {
    rows: result.data ?? [],
    loading: result.isLoading || result.isFetching,
    error: result.error
      ? adminApiErrorMessage(result.error, 'Не вдалося завантажити націнки ЗІЗ.')
      : null,
    reload: result.refetch,
  };
}

/** Next display order: after the last row, so a new row lands at the end of the list. */
export function nextSortOrder(rows: readonly { sortOrder: number }[]): number {
  return rows.reduce((largest, row) => Math.max(largest, row.sortOrder), 0) + 1;
}
