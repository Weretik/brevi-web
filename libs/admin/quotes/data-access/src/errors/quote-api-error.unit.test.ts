import { describe, expect, it } from 'vitest';

import { toQuoteSendApiError } from './quote-api-error';

describe('toQuoteSendApiError', () => {
  it('shows the server reason of a 409 as it is', () => {
    const error = toQuoteSendApiError({
      code: 'Conflict',
      status: 409,
      message: 'Підключіть свій Gmail у «Налаштування КП», щоб надсилати КП.',
      fieldErrors: {},
    });
    expect(error.message).toBe('Підключіть свій Gmail у «Налаштування КП», щоб надсилати КП.');
  });

  it('falls back to a clear text when the server gives none', () => {
    const error = toQuoteSendApiError({
      code: 'Unknown',
      status: 500,
      message: '',
      fieldErrors: {},
    });
    expect(error.message).toBe('Не вдалося надіслати. Спробуйте ще раз.');
  });
});
