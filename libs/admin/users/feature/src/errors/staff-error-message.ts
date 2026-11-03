import type { ApiError } from '@admin/shared/api-client';

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'code' in error && 'message' in error;

/** Turns an RTK Query error from the users API into a message for the dialog. */
export const getStaffErrorMessage = (error: unknown): string => {
  if (!isApiError(error)) {
    return 'Не вдалося виконати дію. Спробуйте ще раз.';
  }

  if (error.status === 409) {
    return 'Користувач з таким email вже існує.';
  }

  if (error.code === 'Forbidden') {
    return 'Лише адміністратор може керувати користувачами.';
  }

  if (error.code === 'NotFound') {
    return 'Користувача не знайдено. Оновіть сторінку.';
  }

  if (error.code === 'Validation') {
    const details = Object.values(error.fieldErrors ?? {}).flat();
    return details.length > 0 ? `Перевірте дані: ${details.join(' ')}` : 'Перевірте введені дані.';
  }

  if (error.code === 'Network' || error.code === 'Timeout') {
    return 'Сервер недоступний. Перевірте зʼєднання та спробуйте ще раз.';
  }

  return 'Не вдалося виконати дію. Спробуйте ще раз.';
};
