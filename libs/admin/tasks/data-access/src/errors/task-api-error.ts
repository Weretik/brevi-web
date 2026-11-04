import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

export const taskErrors = {
  unauthorized: 'Немає доступу до завдань.',
  notFound: 'Завдання не знайдено або воно передане іншому менеджеру.',
  conflict: 'Завдання змінили в іншому вікні. Оновіть сторінку.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

/** A 400 shows the server's first message: the assignee or client rules live on the server. */
export function toTaskApiError(response: unknown) {
  const error = toAdminApiError(response, taskErrors);
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
