import { isAdminApiError } from '@admin/shared/api-client';

export function issuerSettingsError(error: unknown): string {
  if (isAdminApiError(error)) {
    if (error.status === 403) return 'Лише адміністратор може змінювати реквізити продавця.';
    if (error.status === 401) return 'Увійдіть у систему повторно.';
    if (error.status === 409)
      return 'Версія реквізитів змінилася. Оновіть сторінку перед активацією.';
  }
  return error instanceof Error
    ? error.message
    : 'Не вдалося зберегти реквізити. Перевірте дані та повторіть запит.';
}
