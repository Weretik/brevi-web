import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { toAdminApiError, toApiError } from './api-error';

describe('API error normalization', () => {
  it('normalizes an Axios validation response without exposing the raw response', () => {
    const error = new AxiosError('Bad request');
    error.response = {
      data: [{ identifier: 'Request.Name', errorMessage: 'Назва обов’язкова.' }],
      status: 400,
    } as typeof error.response;

    expect(toAdminApiError(error, { badRequest: 'Перевірте введені дані.' })).toEqual({
      code: 'Validation',
      fieldErrors: { name: 'Назва обов’язкова.' },
      message: 'Перевірте введені дані.',
      status: 400,
      traceId: undefined,
    });
  });

  it('normalizes problem details and keeps only safe public fields', () => {
    const error = new AxiosError('Server response');
    error.response = {
      data: { detail: 'Invalid request', errors: { Email: ['Invalid'] }, traceId: 'trace-1' },
      status: 422,
    } as typeof error.response;

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      fieldErrors: { email: 'Invalid' },
      message: 'Invalid request',
      status: 422,
      traceId: 'trace-1',
    });
  });

  it('keeps a bounded backend conflict message for existing feature UX', () => {
    const error = new AxiosError('Conflict');
    error.response = {
      data: [{ errorMessage: 'Запис використовується в іншій сутності.' }],
      status: 409,
    } as typeof error.response;

    expect(toAdminApiError(error, { conflict: 'Не вдалося видалити запис.' })).toMatchObject({
      code: 'Conflict',
      message: 'Запис використовується в іншій сутності.',
      status: 409,
    });
  });
});
