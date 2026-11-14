import {
  useCopyProductionOrderMutation,
  useDeleteProductionOrderMutation,
} from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { useRequestId } from '../requests/use-request-id';

import type { ProductionOrder } from '@admin/production/model';

interface Callbacks {
  onCopied: (copy: ProductionOrder) => void;
  onDeleted: () => void;
  onError: (message: string) => void;
}

/** «Копіювати» makes a new «Нове» order with the same items; «Видалити» is for Admin only. */
export function useProductionOrderActions(order: ProductionOrder | null, callbacks: Callbacks) {
  const [copyOrder, copying] = useCopyProductionOrderMutation();
  const [deleteOrder, deleting] = useDeleteProductionOrderMutation();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const copyRequest = useRequestId();

  async function copy() {
    if (!order) return;
    try {
      const copy = await copyOrder({ id: order.id, requestId: copyRequest.current() }).unwrap();
      copyRequest.renew();
      callbacks.onCopied(copy);
    } catch (error) {
      callbacks.onError(adminApiErrorMessage(error, 'Не вдалося скопіювати завдання.'));
    }
  }

  async function confirmDelete() {
    if (!order) return;
    try {
      await deleteOrder({ id: order.id, version: order.version }).unwrap();
      setConfirmingDelete(false);
      callbacks.onDeleted();
    } catch (error) {
      setConfirmingDelete(false);
      callbacks.onError(adminApiErrorMessage(error, 'Не вдалося видалити завдання.'));
    }
  }

  return {
    copy,
    copying: copying.isLoading,
    deleting: deleting.isLoading,
    confirmingDelete,
    requestDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete,
  };
}
