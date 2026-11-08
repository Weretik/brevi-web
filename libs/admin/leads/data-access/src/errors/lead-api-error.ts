import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

export const leadErrors = {
  unauthorized: 'Немає доступу до лідів.',
  notFound: 'Лід не знайдено.',
  conflict: 'Лід уже змінив інший менеджер. Оновіть сторінку.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

/** A 400 shows the server's first message: the call and taking rules live on the server. */
export function toLeadApiError(response: unknown) {
  const error = toAdminApiError(response, leadErrors);
  if (error.status !== 400 && error.status !== 409) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
