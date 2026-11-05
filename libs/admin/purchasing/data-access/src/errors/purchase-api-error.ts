import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Рахунки на закупку бачать директор, бухгалтер і адміністратор.',
  badRequest: 'Перевірте пошук, сторінку або примітку.',
};

/**
 * Keeps the backend's Ukrainian reason for a running sync (409), a sheet that breaks a rule
 * (422) and Google that cannot be read (503).
 */
export function purchaseApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, messages);
}
