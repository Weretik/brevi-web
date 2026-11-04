import type { QuoteSendForm } from '../entities/quote-send';

export const quoteMaxRecipients = 10;
export const quoteSubjectMax = 300;
export const quoteLetterBodyMax = 10000;

const emailPattern = /^[^@\s"<>,;]+@[^@\s"<>,;]+\.[^@\s"<>,;]+$/;

/** Addresses typed in one field, separated by commas, semicolons or spaces (as the server reads them). */
export function parseQuoteRecipients(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split(/[,;\s]+/)
    .map((part) => part.trim())
    .filter((part) => {
      const key = part.toLowerCase();
      if (!part || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** Problems by field (`to`, `subject`, `body`); empty when the letter can be sent. */
export function quoteSendErrors(form: QuoteSendForm): Partial<Record<keyof QuoteSendForm, string>> {
  const errors: Partial<Record<keyof QuoteSendForm, string>> = {};
  const recipients = parseQuoteRecipients(form.to);
  if (recipients.length === 0) errors.to = 'Вкажіть email отримувача.';
  else if (recipients.length > quoteMaxRecipients)
    errors.to = `Не більше ${quoteMaxRecipients} отримувачів.`;
  else if (!recipients.every((address) => emailPattern.test(address)))
    errors.to = 'Перевірте email отримувача.';
  const subject = form.subject.trim();
  if (!subject) errors.subject = 'Вкажіть тему листа.';
  else if (subject.length > quoteSubjectMax)
    errors.subject = `Не більше ${quoteSubjectMax} символів.`;
  else if (/[\r\n]/.test(subject)) errors.subject = 'Тема — один рядок.';
  const body = form.body.trim();
  if (!body) errors.body = 'Напишіть текст листа.';
  else if (body.length > quoteLetterBodyMax)
    errors.body = `Не більше ${quoteLetterBodyMax} символів.`;
  return errors;
}
