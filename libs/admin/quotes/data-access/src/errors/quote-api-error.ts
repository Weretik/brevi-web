import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

export const quoteErrors = {
  unauthorized: 'Немає доступу до КП.',
  notFound: 'КП не знайдено або воно передане іншому менеджеру.',
  conflict: 'КП змінили в іншому вікні. Оновіть сторінку.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

export const quoteLookupErrors = {
  unauthorized: 'Немає доступу.',
  fallback: 'Не вдалося завантажити список. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

/** A 400 shows the server's first message (price and item rules live on the server too). */
export function toQuoteApiError(response: unknown, messages: AdminApiErrorMessages = quoteErrors) {
  const error = toAdminApiError(response, messages);
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
