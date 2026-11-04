import {
  useGetProductionOrderHistoryQuery,
  useGetProductionOrderQuery,
} from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/** The order card and, once «Історія змін» is open, its history. */
export function useProductionOrder(id: number | null, withHistory: boolean) {
  const order = useGetProductionOrderQuery(id ?? 0, { skip: id === null });
  const history = useGetProductionOrderHistoryQuery(id ?? 0, {
    skip: id === null || !withHistory,
  });
  return {
    order: order.data ?? null,
    loading: order.isLoading,
    error: order.error ? adminApiErrorMessage(order.error, 'Не вдалося відкрити завдання.') : null,
    reload: order.refetch,
    history: history.data ?? [],
    historyLoading: history.isLoading || history.isFetching,
    historyError: history.error
      ? adminApiErrorMessage(history.error, 'Не вдалося завантажити історію.')
      : null,
  };
}
