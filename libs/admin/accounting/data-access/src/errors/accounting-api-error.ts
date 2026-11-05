import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Бухгалтерію бачить лише директор.',
  badRequest: 'Перевірте поля форми.',
};

/** Keeps the backend's Ukrainian reason for a stale version or a taken name (409). */
export function accountingApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
