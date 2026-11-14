import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає прав на «Фонові задачі».',
  badRequest: 'Перевірте розклад.',
};

/** Keeps the backend's Ukrainian reason: «Задача вже виконується», «Запуск уже заплановано» (409). */
export function schedulingApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
