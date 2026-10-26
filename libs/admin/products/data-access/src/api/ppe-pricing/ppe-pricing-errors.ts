import { toAdminApiError } from '@admin/shared/api-client';

export function ppePricingError(response: Parameters<typeof toAdminApiError>[0]) {
  return toAdminApiError(response, {
    unauthorized: 'Немає доступу до цін ЗІЗ.',
    notFound: 'Товар або правило не знайдено.',
    conflict: 'Дані змінилися. Оновіть дані та перевірте нову версію перед збереженням.',
    fallback: 'Не вдалося отримати або зберегти ціни ЗІЗ. Спробуйте ще раз.',
  });
}
