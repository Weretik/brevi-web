import { getStaffErrorMessage } from './staff-error-message';

import type { ApiError } from '@admin/shared/api-client';

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'code' in error && 'status' in error;

/** Messages for own-profile changes; the rest is shared with the users page. */
export const getProfileErrorMessage = (error: unknown): string => {
  if (!isApiError(error)) return getStaffErrorMessage(error);

  if (error.fieldErrors?.['currentPassword']) return 'Поточний пароль неправильний.';
  if (error.status === 413) return 'Фото завелике. Максимум — 2 МБ.';
  if (error.status === 503) {
    return 'Сховище фото ще не налаштоване. Зверніться до адміністратора.';
  }
  if (error.fieldErrors?.['file']) {
    return 'Файл не підходить: потрібне фото JPG, PNG або WebP, щонайменше 128×128 пікселів.';
  }
  if (error.status === 409) return 'Цей email уже використовує інший користувач.';
  if (error.code === 'Forbidden') {
    return 'Це може змінити лише адміністратор або директор.';
  }

  return getStaffErrorMessage(error);
};
