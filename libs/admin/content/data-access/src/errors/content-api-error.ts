import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Товари сайту». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте адресу сторінки та довжину текстів.',
};

/** Keeps the backend's Ukrainian reason for a stale page or a taken address (409). */
export function contentApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
