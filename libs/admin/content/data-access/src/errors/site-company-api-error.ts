import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Контакти та компанія». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте телефони, пошту, реквізити й посилання.',
};

/** Keeps the backend's Ukrainian reason for a stale save (409). */
export function siteCompanyApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
