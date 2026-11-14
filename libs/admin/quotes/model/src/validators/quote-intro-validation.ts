import { quoteNameMaxLength, quoteTextMaxLength } from './quote-draft-validation';
import { quoteIntroEmailMax, quoteIntroTemplateNameMax } from '../forms/introduction/quote-intro-draft';

import type { QuoteIntroDraft } from '../forms/introduction/quote-intro-draft';

/** Errors by place: `internalName`, `recipientEmail`, `managerNote`, `pages`, `slot:<key>`. */
export type QuoteIntroErrors = Readonly<Record<string, string>>;

const emailPattern = /^[^@\s"<>,;]+@[^@\s"<>,;]+\.[^@\s"<>,;]+$/;

/** The rules of «Зберегти» and «Зберегти як шаблон»: every page has 4 models with a fabric, none twice. */
export function quoteIntroPageErrors(draft: QuoteIntroDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const seen = new Set<number>();
  for (const page of draft.pages)
    for (const slot of page.slots) {
      if (slot.productId === null) errors[`slot:${slot.key}`] = slot.problem ?? 'Оберіть модель.';
      else if (slot.articleId === null)
        errors[`slot:${slot.key}`] = slot.problem ?? 'Оберіть тканину.';
      else if (seen.has(slot.productId)) {
        errors[`slot:${slot.key}`] = 'Ця модель вже є в добірці.';
        errors['pages'] = 'Одна модель може бути в добірці лише раз.';
      }
      if (slot.productId !== null) seen.add(slot.productId);
    }
  return errors;
}

export function quoteIntroErrors(draft: QuoteIntroDraft): QuoteIntroErrors {
  const errors = quoteIntroPageErrors(draft);
  const name = draft.internalName.trim();
  if (!name) errors['internalName'] = 'Вкажіть клієнта або назву запиту.';
  else if (name.length > quoteNameMaxLength)
    errors['internalName'] = `Не більше ${quoteNameMaxLength} символів.`;
  const email = draft.recipientEmail.trim();
  if (email && (email.length > quoteIntroEmailMax || !emailPattern.test(email)))
    errors['recipientEmail'] = 'Перевірте email отримувача.';
  if (draft.recipientName.length > quoteNameMaxLength)
    errors['recipientName'] = `Не більше ${quoteNameMaxLength} символів.`;
  if (draft.companyName.length > quoteNameMaxLength)
    errors['companyName'] = `Не більше ${quoteNameMaxLength} символів.`;
  if (draft.managerNote.length > quoteTextMaxLength)
    errors['managerNote'] = `Не більше ${quoteTextMaxLength} символів.`;
  return errors;
}

export function quoteIntroTemplateNameError(name: string): string | null {
  const text = name.trim();
  if (!text) return 'Вкажіть назву шаблону.';
  return text.length > quoteIntroTemplateNameMax
    ? `Не більше ${quoteIntroTemplateNameMax} символів.`
    : null;
}
