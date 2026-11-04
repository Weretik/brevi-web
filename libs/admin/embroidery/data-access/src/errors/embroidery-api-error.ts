import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

export const embroideryErrors = {
  unauthorized: 'Немає доступу до розрахунку вишивки.',
  notFound: 'Розрахунок вишивки не знайдено.',
  conflict: 'Налаштування вже змінив хтось інший. Оновіть сторінку, щоб побачити їх.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

/** A 400 shows the server's first message: the rules live on the server. */
export function toEmbroideryApiError(response: unknown) {
  const error = toAdminApiError(response, embroideryErrors);
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
