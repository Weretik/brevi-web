import type { ApiError } from '@admin/shared/api-client';

export type AccessOperation = 'load' | 'save' | 'create' | 'delete';

export interface AccessErrorMessage {
  message: string;
  /** Someone else saved the role first: the page offers «Перезавантажити». */
  conflict: boolean;
}

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'code' in error && 'message' in error;

const fallback = 'Не вдалося виконати дію. Спробуйте ще раз.';

export const isForbiddenError = (error: unknown): boolean =>
  isApiError(error) && (error.code === 'Forbidden' || error.status === 403);

/** Turns an RTK Query error from the access API into a message for the page or the panel. */
export const getAccessErrorMessage = (
  error: unknown,
  operation: AccessOperation,
): AccessErrorMessage => {
  const result = (message: string, conflict = false) => ({ message, conflict });
  if (!isApiError(error)) return result(fallback);

  if (error.status === 409) {
    if (operation === 'save') {
      return result(
        'Цю роль щойно змінив інший адміністратор. Перезавантажте права, щоб побачити його зміни.',
        true,
      );
    }
    if (operation === 'create') return result('Роль з такою назвою вже існує.');
    if (operation === 'delete') {
      return result('Роль ще мають користувачі. Спершу змініть їм роль на сторінці «Користувачі».');
    }
  }

  if (isForbiddenError(error)) {
    return result('Лише адміністратор може керувати правами доступу.');
  }

  if (error.code === 'NotFound') {
    return result('Роль не знайдено. Перезавантажте права.', operation === 'save');
  }

  if (error.status === 400 && operation === 'delete') {
    return result('Вбудовану роль не можна видалити.');
  }

  if (error.code === 'Validation' || error.status === 400) {
    const details = Object.values(error.fieldErrors ?? {}).flat();
    return result(
      details.length > 0 ? `Перевірте дані: ${details.join(' ')}` : 'Перевірте введені дані.',
    );
  }

  if (error.code === 'Network' || error.code === 'Timeout') {
    return result('Сервер недоступний. Перевірте зʼєднання та спробуйте ще раз.');
  }

  return result(fallback);
};
