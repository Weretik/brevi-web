import { describe, expect, it } from 'vitest';

import { HttpError, toAdminApiError, toApiError } from './api-error';

describe('API error normalization', () => {
  it('normalizes a validation response without exposing the raw response', () => {
    const error = new HttpError(400, [
      { identifier: 'Request.Name', errorMessage: 'Назва обов’язкова.' },
    ]);

    expect(toAdminApiError(error, { badRequest: 'Перевірте введені дані.' })).toEqual({
      code: 'Validation',
      fieldErrors: { name: 'Назва обов’язкова.' },
      message: 'Перевірте введені дані.',
      status: 400,
      traceId: undefined,
    });
  });

  it('normalizes problem details and keeps only safe public fields', () => {
    const error = new HttpError(422, {
      detail: 'Invalid request',
      errors: { Email: ['Invalid'] },
      traceId: 'trace-1',
    });

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      fieldErrors: { email: 'Invalid' },
      message: 'Invalid request',
      status: 422,
      traceId: 'trace-1',
    });
  });

  it('keeps a bounded backend conflict message for existing feature UX', () => {
    const error = new HttpError(409, [
      { errorMessage: 'Запис використовується в іншій сутності.' },
    ]);

    expect(toAdminApiError(error, { conflict: 'Не вдалося видалити запис.' })).toMatchObject({
      code: 'Conflict',
      message: 'Запис використовується в іншій сутності.',
      status: 409,
    });
  });

  it('reads a backend { errors: [text] } body such as a 503 from an external system', () => {
    const error = new HttpError(503, { errors: ['Google не дає доступу до таблиці.'] });

    expect(toApiError(error)).toMatchObject({
      code: 'Server',
      message: 'Google не дає доступу до таблиці.',
      status: 503,
    });
  });
});

describe('transport failures', () => {
  it('maps a failed connection, a timeout and an unknown value', () => {
    expect(toApiError(new TypeError('Failed to fetch'))).toMatchObject({ code: 'Network' });
    expect(toApiError(new DOMException('late', 'TimeoutError'))).toMatchObject({ code: 'Timeout' });
    expect(toApiError('boom')).toMatchObject({ code: 'Unknown', status: 0 });
  });
});
