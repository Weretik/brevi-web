import { useChangeProductionOrderStatusMutation } from '@admin/production/data-access';
import { validateCancelReason } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductionOrder } from '@admin/production/model';

/** «Закрити», «Скасувати» with a reason and «Повернути в роботу». */
export function useProductionOrderStatus(
  order: ProductionOrder | null,
  onMessage: (message: string) => void,
) {
  const [change, changing] = useChangeProductionOrderStatusMutation();
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);

  async function run(action: 'close' | 'reopen', done: string) {
    if (!order) return;
    try {
      await change({ id: order.id, version: order.version, action }).unwrap();
      onMessage(done);
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося змінити статус завдання.'));
    }
  }

  async function confirmCancel() {
    if (!order) return;
    const error = validateCancelReason(reason);
    setReasonError(error);
    if (error) return;
    try {
      await change({
        id: order.id,
        version: order.version,
        action: 'cancel',
        reason: reason.trim(),
      }).unwrap();
      setCancelling(false);
      onMessage('Завдання скасовано.');
    } catch (failure) {
      setReasonError(adminApiErrorMessage(failure, 'Не вдалося скасувати завдання.'));
    }
  }

  return {
    busy: changing.isLoading,
    close: () => run('close', 'Завдання закрито.'),
    reopen: () => run('reopen', 'Завдання повернуто в роботу.'),
    cancelling,
    reason,
    reasonError,
    requestCancel: () => {
      setReason('');
      setReasonError(null);
      setCancelling(true);
    },
    changeReason: setReason,
    closeCancel: () => setCancelling(false),
    confirmCancel,
  };
}
