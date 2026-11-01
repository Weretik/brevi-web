import type {
  EmailTemplateDraft,
  EmailTemplateDraftErrors,
} from '../../forms/documents/email-template-draft';

export function emailTemplateDraftErrors(value: EmailTemplateDraft): EmailTemplateDraftErrors {
  const errors: EmailTemplateDraftErrors = {};
  for (const [key, maximum] of [
    ['name', 120],
    ['subject', 200],
    ['body', 3000],
  ] as const) {
    if (!value[key].trim() || value[key].trim().length > maximum || value[key].includes('\0'))
      errors[key] = `Вкажіть текст до ${maximum} символів.`;
  }
  if (/[\r\n]/.test(value.subject)) errors.subject = 'Тема має бути одним рядком.';
  for (const key of ['subject', 'body'] as const) {
    const remainder = value[key].replace(/\{(?:recipientName|managerName|quoteNumber)\}/g, '');
    if (/[{}]/.test(remainder))
      errors[key] = 'Дозволені лише recipientName, managerName та quoteNumber у фігурних дужках.';
  }
  return errors;
}
