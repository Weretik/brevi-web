import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Переадресації». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте стару адресу, нову сторінку (з /uk або /ru) і довжину примітки.',
};

/** Keeps the backend's Ukrainian reason for a taken old address, a loop or too many redirects (409). */
export function redirectApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
