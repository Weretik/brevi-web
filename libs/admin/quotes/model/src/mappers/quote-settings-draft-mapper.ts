import type { QuoteSettings } from '../entities/quote-settings';
import type { QuoteLetterVariantDraft, QuoteSettingsDraft } from '../models/quote-settings-draft';

/** Replaces null with '' in every field of a flat section. */
function texts<T extends object>(value: T): { [K in keyof T]: string } {
  return Object.fromEntries(
    Object.entries(value).map(([key, field]) => [key, (field as string | null) ?? '']),
  ) as { [K in keyof T]: string };
}

let nextKey = 0;
const letterKey = () => `letter-${++nextKey}`;

export function emptyLetterVariantDraft(): QuoteLetterVariantDraft {
  return { key: letterKey(), name: '', subject: '', body: '' };
}

export function quoteSettingsToDraft(settings: QuoteSettings): QuoteSettingsDraft {
  const { advantages, ...introduction } = settings.introduction;
  const { intros, labels, ...pdfTexts } = settings.pdf;
  return {
    version: settings.version,
    company: texts(settings.company),
    email: texts(settings.email),
    pdf: {
      ...texts(pdfTexts),
      intros: texts(intros),
      labels: texts(labels),
    },
    introduction: { ...texts(introduction), advantages: advantages.map(texts) },
    letterVariants: settings.letterVariants.map((variant) => ({
      key: letterKey(),
      ...texts(variant),
    })),
    staffContacts: settings.staffContacts.map((contact) => ({
      ...texts(contact),
      userId: contact.userId,
    })),
  };
}
