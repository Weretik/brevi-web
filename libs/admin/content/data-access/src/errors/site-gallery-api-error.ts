import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на цю сторінку. Його дає директор у «Права доступу».',
  badRequest: 'Перевірте фото й тексти.',
};

/** Keeps the backend's Ukrainian reason for a refused save and a stale revision (409). */
export function siteGalleryApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
