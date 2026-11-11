import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Статті». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте назву українською, адресу, дату статті та довжину текстів.',
};

/** Keeps the backend's Ukrainian reason for a stale article, a taken address or a missing photo (409). */
export function articleApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
