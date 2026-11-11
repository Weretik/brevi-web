import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Рух складу записує начальник цеху або адміністратор.',
  notFound: 'Тканину, колір чи рух не знайдено. Оновіть сторінку.',
  conflict: 'Склад уже змінили. Оновіть сторінку.',
  fallback: 'Не вдалося виконати запит до складу. Спробуйте ще раз.',
};

/**
 * Keeps the server's Ukrainian reason: a 400 shows its first field message (a shortage
 * «Уточнити» refuses, an inactive fabric), a 409 its conflict (stale pair, opening already made).
 */
export function warehouseApiError(response: unknown): AdminApiError {
  const error = toAdminApiError(response, messages);
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}
