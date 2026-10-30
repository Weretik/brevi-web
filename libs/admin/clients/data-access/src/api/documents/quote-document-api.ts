import { adminApi, isAdminApiError, toAdminApiError } from '@admin/shared/api-client';

export const quoteDocumentApi = adminApi.enhanceEndpoints({
  addTagTypes: ['QuoteDelivery', 'Quote'],
});
export const documentQuoteUrl = (id: string) => `/api/crm/quotes/${encodeURIComponent(id)}`;
export function quoteDocumentError(error: unknown) {
  const mapped = toAdminApiError(error, {
    conflict: 'Дані або попередня спроба змінилися. Оновіть історію та КП.',
    notFound: 'КП або документ не знайдено чи доступ обмежено.',
    badRequest: 'Перевірте версію, PDF, одержувача та вибрані варіанти.',
    fallback: 'Не вдалося виконати дію з КП.',
  });
  return isAdminApiError(mapped) && mapped.status === 503
    ? {
        ...mapped,
        message:
          'Поштовий сервіс не налаштовано або тимчасово недоступний. Після відновлення повторіть той самий запит.',
      }
    : mapped;
}
