import { describe, expect, it } from 'vitest';

import { parseQuoteRecipients, quoteSendErrors } from './quote-send-validation';

describe('quote sending rules', () => {
  it('splits recipients like the server', () => {
    expect(parseQuoteRecipients(' a@agro.ua; b@agro.ua,A@agro.ua  c@agro.ua ')).toEqual([
      'a@agro.ua',
      'b@agro.ua',
      'c@agro.ua',
    ]);
  });

  it('needs valid addresses, a one-line subject and text', () => {
    const ok = { to: 'client@agro.ua', subject: 'КП № 1', body: 'Добрий день' };
    expect(quoteSendErrors(ok)).toEqual({});
    expect(quoteSendErrors({ ...ok, to: 'client@agro' }).to).toBe('Перевірте email отримувача.');
    expect(quoteSendErrors({ ...ok, to: ' ' }).to).toBe('Вкажіть email отримувача.');
    expect(quoteSendErrors({ ...ok, subject: 'КП\nBcc: x@y.ua' }).subject).toBe(
      'Тема — один рядок.',
    );
    expect(quoteSendErrors({ ...ok, body: ' ' }).body).toBe('Напишіть текст листа.');
  });
});
