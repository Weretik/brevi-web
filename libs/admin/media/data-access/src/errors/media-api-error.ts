import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

const common = {
  unauthorized: 'Немає доступу до фото.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

export const mediaFolderErrors = {
  ...common,
  notFound: 'Папку не знайдено. Оновіть сторінку.',
  conflict: 'Папку не вдалося змінити.',
} satisfies AdminApiErrorMessages;

export const mediaFileErrors = {
  ...common,
  notFound: 'Фото або папку не знайдено. Оновіть сторінку.',
  conflict: 'Фото використовується, його не можна видалити.',
} satisfies AdminApiErrorMessages;

/**
 * Like toAdminApiError, but a 400 shows the backend's first field message (for example
 * «Файл не схожий на зображення»), because upload and name rules live on the server.
 */
export function toMediaApiError(response: unknown, messages: AdminApiErrorMessages) {
  const error = toAdminApiError(response, messages);
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
