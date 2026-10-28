import { toAdminApiError } from '@admin/shared/api-client';

export const quoteApiError = (value: unknown) =>
  toAdminApiError(value, {
    conflict:
      'КП або джерело ціни змінилися, чи розрахунок прострочений. Введення збережене: оновіть дані або явно отримайте новий розрахунок.',
    notFound: 'КП чи клієнта не знайдено або доступ обмежено.',
    badRequest: 'Перевірте одержувача, позиції та ціни КП.',
    fallback: 'Не вдалося виконати дію з КП. Повтор запиту використає той самий ідентифікатор.',
  });
