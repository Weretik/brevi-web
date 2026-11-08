import { toAdminApiError, toApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

export const leadErrors = {
  unauthorized: 'Немає доступу до лідів.',
  notFound: 'Лід не знайдено.',
  conflict: 'Лід уже змінив інший менеджер. Оновіть сторінку.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

/**
 * A 400 or 409 shows the server's first field message: the call and taking rules live on the server. A failed sync
 * (503: Google cannot be read, 422: unexpected sheet) shows the server's own explanation, like «відкрийте таблицю
 * для сервісного акаунта».
 */
export function toLeadApiError(response: unknown) {
  const error = toAdminApiError(response, leadErrors);
  if (error.status === 503 || error.status === 422) {
    const server = toApiError(response);
    const fromServer = server.message && !server.message.startsWith('Request failed');
    return fromServer ? { ...error, message: server.message } : error;
  }
  if (error.status !== 400 && error.status !== 409) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
