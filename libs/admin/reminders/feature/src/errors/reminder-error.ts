import { adminApiErrorMessage } from '@admin/shared/api-client';

export function reminderError(
  error: unknown,
  fallback = 'Не вдалося виконати дію з нагадуваннями.',
): string {
  return adminApiErrorMessage(error, fallback);
}
