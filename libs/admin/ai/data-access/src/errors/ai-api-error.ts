import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Налаштування ШІ бачить лише адміністратор.',
  badRequest: 'Перевірте моделі, ціни, ліміт або ключ.',
};

/** Keeps the backend's Ukrainian reason: stale version (409), OpenAI refused (422) or unavailable (503). */
export function aiApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
