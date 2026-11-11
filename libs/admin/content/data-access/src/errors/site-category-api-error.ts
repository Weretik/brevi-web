import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Розділи сайту». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте назву українською, адресу розділу та довжину текстів.',
};

/** Keeps the backend's Ukrainian reason for a stale category, a taken address or a refused move (409). */
export function siteCategoryApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
