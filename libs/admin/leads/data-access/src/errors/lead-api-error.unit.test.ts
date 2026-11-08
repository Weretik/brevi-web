import { describe, expect, it } from 'vitest';

import { leadErrors, toLeadApiError } from './lead-api-error';

const apiError = (status: number, message: string) => ({
  code: 'Server' as const,
  status,
  message,
  fieldErrors: {},
});

describe('toLeadApiError', () => {
  it('shows why the sheet could not be read', () => {
    const text =
      'Google не дає доступу до таблиці «Лиды Brevi»: відкрийте її для сервісного акаунта Cloud Run (роль «Читач»).';
    expect(toLeadApiError(apiError(503, text)).message).toBe(text);
  });

  it('keeps the generic text when the server sent none', () => {
    expect(toLeadApiError(apiError(503, 'Request failed with status code 503')).message).toBe(
      leadErrors.fallback,
    );
    expect(toLeadApiError(apiError(500, 'boom')).message).toBe(leadErrors.fallback);
  });
});
