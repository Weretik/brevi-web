import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає права на «Налаштування SEO сайту». Його дає директор у «Права доступу».',
  badRequest: 'Перевірте формат ідентифікаторів і кодів підтвердження.',
};

/** Keeps the backend's Ukrainian reason for a stale save or a missing photo (409). */
export function seoSettingsApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
