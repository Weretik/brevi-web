import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Сторінки сайту». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте довжину заголовків і описів.',
};

/** Keeps the backend's Ukrainian reason for a stale save (409) or an unknown page (404). */
export function sitePageApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
