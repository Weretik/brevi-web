import { unknownQuoteMarks } from '../mappers/quote-template-marks';
import {
  quoteAdvantageCount,
  quoteMaxLetterVariants,
  quotePdfIntroCases,
  quotePdfIntroMarks,
  quoteTemplateMarks,
} from '../models/quote-settings-draft';

import type { QuoteMark, QuoteSettingsDraft } from '../models/quote-settings-draft';

export const quoteSettingsShortMax = 300;
export const quoteSettingsTextMax = 4000;
export const quoteSettingsUrlMax = 1000;

/** Problems by field path, such as `company.edrpou` or `letter:<key>.subject`. Empty when it can be saved. */
export type QuoteSettingsErrors = Readonly<Record<string, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const colorPattern = /^#[0-9a-fA-F]{6}$/;

function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Mirrors the server rules so mistakes show next to the field. */
export function quoteSettingsErrors(draft: QuoteSettingsDraft): QuoteSettingsErrors {
  const errors: Record<string, string> = {};
  const check = (path: string, value: string, rule: (text: string) => string | null) => {
    const text = value.trim();
    const message = rule(text);
    if (message) errors[path] = message;
  };
  const required = (max: number) => (text: string) =>
    !text ? 'Обовʼязкове поле.' : text.length > max ? `Не більше ${max} символів.` : null;
  const optional = (max: number) => (text: string) =>
    text.length > max ? `Не більше ${max} символів.` : null;
  const email = (text: string) =>
    text && !emailPattern.test(text) ? 'Невірна адреса пошти.' : null;
  /** A typo in a mark reaches the client as it is, so it is an error. */
  const marks =
    (rule: (text: string) => string | null, allowed: readonly QuoteMark[] = quoteTemplateMarks) =>
    (text: string): string | null => {
      const unknown = unknownQuoteMarks(text, allowed);
      return (
        rule(text) ??
        (unknown.length > 0
          ? `Невідома мітка ${unknown.join(', ')}. Вставте мітку кнопкою під полем.`
          : null)
      );
    };
  const url = (text: string) =>
    !text
      ? null
      : text.length > quoteSettingsUrlMax || !isWebUrl(text)
        ? 'Посилання має починатися з https://'
        : null;

  const { company, pdf, introduction } = draft;
  check('company.name', company.name, required(quoteSettingsShortMax));
  check('company.edrpou', company.edrpou, (text) =>
    text && !/^\d{8}$/.test(text) ? 'ЄДРПОУ — 8 цифр.' : null,
  );
  check('company.taxId', company.taxId, (text) =>
    text && !/^\d{10,12}$/.test(text) ? 'ІПН — від 10 до 12 цифр.' : null,
  );
  check('company.iban', company.iban, (text) =>
    text && !/^UA\d{2}[\d ]{20,40}$/.test(text) ? 'IBAN має виглядати як UA00 0000…' : null,
  );
  check('company.address', company.address, optional(quoteSettingsShortMax));
  check('company.phone', company.phone, optional(50));
  check('company.email', company.email, email);
  check('company.site', company.site, url);
  check('company.logoUrl', company.logoUrl, url);

  check('email.subject', draft.email.subject, marks(required(quoteSettingsShortMax)));
  check('email.body', draft.email.body, marks(required(quoteSettingsTextMax)));

  check('pdf.title', pdf.title, required(quoteSettingsShortMax));
  for (const key of ['vatNotice', 'ctaTitle', 'ctaText'] as const)
    check(`pdf.${key}`, pdf[key], optional(quoteSettingsTextMax));
  check('pdf.ctaContactTemplate', pdf.ctaContactTemplate, marks(optional(quoteSettingsTextMax)));
  for (const { key } of quotePdfIntroCases)
    check(
      `pdf.intros.${key}`,
      pdf.intros[key],
      marks(optional(quoteSettingsTextMax), quotePdfIntroMarks),
    );
  check('pdf.labels.contactLine', pdf.labels.contactLine, marks(optional(quoteSettingsShortMax)));
  for (const key of [
    'codeLabel',
    'siteLink',
    'fabricsTitle',
    'recommended',
    'commentTitle',
    'clientTitle',
  ] as const)
    check(`pdf.labels.${key}`, pdf.labels[key], optional(quoteSettingsShortMax));

  check('introduction.summerBannerUrl', introduction.summerBannerUrl, url);
  check('introduction.winterBannerUrl', introduction.winterBannerUrl, url);
  check('introduction.assortmentUrl', introduction.assortmentUrl, url);
  check('introduction.accentColor', introduction.accentColor, (text) =>
    text && !colorPattern.test(text) ? 'Колір у форматі #RRGGBB.' : null,
  );
  check('introduction.summerMainCode', introduction.summerMainCode, optional(100));
  check('introduction.winterMainCode', introduction.winterMainCode, optional(100));
  if (introduction.advantages.length !== quoteAdvantageCount)
    errors['introduction.advantages'] = `Потрібно ${quoteAdvantageCount} переваг.`;
  introduction.advantages.forEach((advantage, index) => {
    check(`advantage:${index}.title`, advantage.title, required(quoteSettingsShortMax));
    check(`advantage:${index}.text`, advantage.text, optional(quoteSettingsTextMax));
  });

  if (draft.letterVariants.length > quoteMaxLetterVariants)
    errors['letterVariants'] = `Не більше ${quoteMaxLetterVariants} варіантів листа.`;
  for (const variant of draft.letterVariants) {
    check(`letter:${variant.key}.name`, variant.name, required(quoteSettingsShortMax));
    check(`letter:${variant.key}.subject`, variant.subject, marks(required(quoteSettingsShortMax)));
    check(`letter:${variant.key}.body`, variant.body, marks(required(quoteSettingsTextMax)));
  }

  for (const contact of draft.staffContacts) {
    check(`staff:${contact.userId}.name`, contact.name, required(quoteSettingsShortMax));
    check(`staff:${contact.userId}.phone`, contact.phone, optional(50));
    check(`staff:${contact.userId}.email`, contact.email, email);
  }
  return errors;
}
