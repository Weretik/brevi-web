import { describe, expect, it } from 'vitest';

import { emailTemplateDraftErrors } from './email-template-draft-validation';

const draft = {
  name: 'Пропозиція',
  subject: 'КП {quoteNumber}',
  body: 'Вітаємо, {recipientName}. {managerName}',
};

describe('email template input validation', () => {
  it('accepts all supported public placeholders in plain text', () => {
    expect(emailTemplateDraftErrors(draft)).toEqual({});
  });
  it('blocks empty and oversized content', () => {
    expect(
      emailTemplateDraftErrors({ name: ' ', subject: 'x'.repeat(201), body: 'x'.repeat(3001) }),
    ).toEqual({
      name: expect.any(String),
      subject: expect.any(String),
      body: expect.any(String),
    });
  });
  it('rejects a subject containing a header newline', () => {
    expect(
      emailTemplateDraftErrors({ ...draft, subject: 'КП\r\nBcc: attacker@example.test' }).subject,
    ).toBeTruthy();
  });
  it.each(['{cost}', '{recipientName', 'recipientName}', '{{recipientName}}'])(
    'rejects unsupported or malformed placeholder %s',
    (body) => {
      expect(emailTemplateDraftErrors({ ...draft, body }).body).toBeTruthy();
    },
  );
});
