import { isAdminApiError, toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  conflict: 'Дію не виконано: дані вже змінилися. Оновіть сторінку.',
  notFound: 'Запис не знайдено. Можливо, його вже видалили.',
  badRequest: 'Перевірте введені дані.',
  unauthorized: 'Недостатньо прав для нагадувань.',
  fallback: 'Не вдалося виконати дію з нагадуваннями.',
};

/** Reminder conflicts carry a short Ukrainian reason from the backend («Період уже закрито.»); keep it. */
export function reminderApiError(value: unknown): AdminApiError {
  const error = toAdminApiError(value, messages);
  if (error.status === 409 && isAdminApiError(value) && value.message.trim())
    return { ...error, message: value.message };
  return error;
}
