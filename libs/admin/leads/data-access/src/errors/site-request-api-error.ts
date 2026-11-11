import { toAdminApiError, toApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

export const siteRequestErrors = {
  unauthorized: 'Немає доступу до заявок з сайту.',
  notFound: 'Заявку не знайдено.',
  conflict: 'Заявку вже змінив інший менеджер. Оновіть сторінку.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

/**
 * A 400 shows the server's first field message; a 403 shows the server's reason («Закрити або повернути заявку може
 * той, хто її взяв…») when it sent one: who may close a request is decided there.
 */
export function toSiteRequestApiError(response: unknown) {
  const error = toAdminApiError(response, siteRequestErrors);
  if (error.status === 403) {
    const server = toApiError(response);
    const fromServer = server.message && !server.message.startsWith('Request failed');
    return fromServer ? { ...error, message: server.message } : error;
  }
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
