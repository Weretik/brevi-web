import { describe, expect, it } from 'vitest';

import { getAccessErrorMessage, isForbiddenError } from './access-error-message';

import type { ApiError } from '@admin/shared/api-client';

const apiError = (status: number, code: ApiError['code'], message = ''): ApiError => ({
  status,
  code,
  message,
  fieldErrors: {},
});

describe('getAccessErrorMessage', () => {
  it('offers a reload when someone else saved the role', () => {
    expect(getAccessErrorMessage(apiError(409, 'Conflict'), 'save')).toEqual({
      message:
        'Цю роль щойно змінив інший адміністратор. Перезавантажте права, щоб побачити його зміни.',
      conflict: true,
    });
  });

  it('explains conflicts on create and delete', () => {
    expect(getAccessErrorMessage(apiError(409, 'Conflict'), 'create').message).toBe(
      'Роль з такою назвою вже існує.',
    );
    expect(getAccessErrorMessage(apiError(409, 'Conflict'), 'delete').message).toMatch(
      /Спершу змініть їм роль/,
    );
    expect(getAccessErrorMessage(apiError(400, 'Validation'), 'delete').message).toBe(
      'Вбудовану роль не можна видалити.',
    );
  });

  it('recognises a forbidden answer and unknown errors', () => {
    expect(isForbiddenError(apiError(403, 'Forbidden'))).toBe(true);
    expect(getAccessErrorMessage(new Error('x'), 'load').message).toBe(
      'Не вдалося виконати дію. Спробуйте ще раз.',
    );
  });
});
