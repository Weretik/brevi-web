import {
  useGetProductionOrderHistoryQuery,
  useGetProductionOrderQuery,
} from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { usePageRights } from '@admin/shared/ui';
import { useMemo } from 'react';

/**
 * The order card and, once «Історія змін» is open, its history. The server's role rules on the order are narrowed by
 * «Права доступу» → «Виробничі завдання»: copy needs «Створення», delete «Видалення», everything else «Редагування».
 */
export function useProductionOrder(id: number | null, withHistory: boolean) {
  const order = useGetProductionOrderQuery(id ?? 0, { skip: id === null });
  const { canCreate, canEdit, canDelete } = usePageRights();
  const narrowed = useMemo(() => {
    const data = order.data;
    if (!data) return null;
    const p = data.permissions;
    return {
      ...data,
      permissions: {
        ...p,
        canEdit: p.canEdit && canEdit,
        canCopy: p.canCopy && canCreate,
        canDelete: p.canDelete && canDelete,
        canTrack: p.canTrack && canEdit,
        canClose: p.canClose && canEdit,
        canCancel: p.canCancel && canEdit,
        canReopen: p.canReopen && canEdit,
        canManageFiles: p.canManageFiles && canEdit,
        canSendTelegram: p.canSendTelegram && canEdit,
      },
    };
  }, [order.data, canCreate, canEdit, canDelete]);
  const history = useGetProductionOrderHistoryQuery(id ?? 0, {
    skip: id === null || !withHistory,
  });
  return {
    order: narrowed,
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
