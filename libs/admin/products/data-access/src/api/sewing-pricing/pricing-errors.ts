import { toAdminApiError } from '@admin/shared/api-client';

export function sewingPricingError(response: Parameters<typeof toAdminApiError>[0]) {
  return toAdminApiError(response, {
    unauthorized: 'Немає доступу до цін цього товару.',
    notFound: 'Опубліковану ціну або розрахунок не знайдено.',
    conflict: 'Дані змінилися або розрахунок заблоковано. Розрахуйте ціну повторно.',
    fallback: 'Не вдалося отримати або зберегти ціну. Спробуйте ще раз.',
  });
}
