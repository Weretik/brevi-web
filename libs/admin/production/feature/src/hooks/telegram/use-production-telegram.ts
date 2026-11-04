import { useSendProductionOrderTelegramMutation } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';

import type { ProductionOrder } from '@admin/production/model';

/** «Надіслати в цех»: a failure stays on the card with its reason, so only a request error is a message. */
export function useProductionTelegram(
  order: ProductionOrder | null,
  onMessage: (message: string) => void,
) {
  const [send, sending] = useSendProductionOrderTelegramMutation();

  async function run() {
    if (!order) return;
    try {
      const next = await send({ id: order.id }).unwrap();
      if (next.telegram.status === 'Sent') onMessage('Повідомлення надіслано в цех.');
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося надіслати повідомлення в цех.'));
    }
  }

  return { busy: sending.isLoading, send: run };
}
