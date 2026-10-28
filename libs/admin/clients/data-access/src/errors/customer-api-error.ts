import { toAdminApiError } from '@admin/shared/api-client';

export const customerApiError = (value: unknown) =>
  toAdminApiError(value, {
    conflict: 'Запис змінився або запит конфліктує. Оновіть дані й порівняйте зміни.',
    notFound: 'Клієнта не знайдено або доступ обмежено.',
    badRequest: 'Перевірте введені дані.',
    fallback: 'Не вдалося виконати дію з клієнтом.',
  });
