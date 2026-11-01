import { Alert } from '@mui/material';

import type { QuoteDeliveryView } from '@admin/clients/model';

export function QuoteDeliveryOutcome({ delivery }: { delivery: QuoteDeliveryView }) {
  const message = delivery.manualResolution
    ? delivery.manualResolution.outcome === 'sent'
      ? 'Надсилання підтверджено вручну. Підстава збережена в історії.'
      : 'Ненадсилання підтверджено вручну. Автоматичної повторної відправки немає.'
    : delivery.state === 'succeeded'
      ? 'Прийняття листа підтверджено провайдером. Оновіть стан КП із сервера.'
      : delivery.state === 'unknown'
        ? 'Результат надсилання невідомий. Перевірте точний лист у Gmail вручну та зафіксуйте результат в історії.'
        : delivery.state === 'failed'
          ? 'Спроба завершилася без підтвердження надсилання.'
          : delivery.state === 'queued'
            ? 'Лист поставлено в чергу. Це ще не підтвердження надсилання.'
            : 'Сервер обробляє попередню спробу. Перевіряйте історію надсилань.';
  return <Alert severity={delivery.state === 'succeeded' ? 'success' : 'info'}>{message}</Alert>;
}
