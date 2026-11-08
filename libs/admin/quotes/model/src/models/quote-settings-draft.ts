/** Editable text of a settings section: an empty field is saved as «не вказано». */
type TextFields<T> = { [K in keyof T]: string };

export type QuoteCompanyDraft = TextFields<{
  name: string;
  edrpou: string;
  taxId: string;
  iban: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  logoUrl: string;
}>;

export interface QuoteEmailTemplateDraft {
  subject: string;
  body: string;
}

export interface QuotePdfTextsDraft {
  title: string;
  vatNotice: string;
  ctaTitle: string;
  ctaText: string;
  ctaContactTemplate: string;
  intros: QuotePdfIntroTextsDraft;
  labels: QuotePdfLabelsDraft;
  showClient: boolean;
}

export type QuotePdfIntroCase =
  'onePpe' | 'oneSewing' | 'oneSewingOnePpe' | 'sewing' | 'ppe' | 'sewingAndPpe' | 'fallback';

/** An empty text is saved as «не вказано», so the PDF uses the standard one. */
export type QuotePdfIntroTextsDraft = Record<QuotePdfIntroCase, string>;

export interface QuotePdfLabelsDraft {
  contactLine: string;
  codeLabel: string;
  siteLink: string;
  fabricsTitle: string;
  recommended: string;
  commentTitle: string;
  clientTitle: string;
}

/** When the PDF takes each opening text, in the order the settings page shows them. */
export const quotePdfIntroCases: readonly {
  readonly key: QuotePdfIntroCase;
  readonly when: string;
}[] = [
  { key: 'onePpe', when: 'Лише один ЗІЗ' },
  { key: 'oneSewing', when: 'Одна модель з одним варіантом тканини' },
  { key: 'oneSewingOnePpe', when: 'Одна модель з однією тканиною і один ЗІЗ' },
  { key: 'sewing', when: 'Кілька моделей або тканин, без ЗІЗ' },
  { key: 'ppe', when: 'Кілька ЗІЗ, без пошиву' },
  { key: 'sewingAndPpe', when: 'Кілька позицій: і пошив, і ЗІЗ' },
  { key: 'fallback', when: 'Усе інше, наприклад лише вишивка' },
];

export interface QuoteAdvantageDraft {
  title: string;
  text: string;
}

export interface QuoteIntroductionDraft {
  logoText: string;
  summerTitle: string;
  winterTitle: string;
  subtitle: string;
  summerBannerUrl: string;
  winterBannerUrl: string;
  modelsTitle: string;
  assortmentLinkText: string;
  assortmentUrl: string;
  productButtonText: string;
  nextStepText: string;
  accentColor: string;
  summerMainCode: string;
  winterMainCode: string;
  advantages: QuoteAdvantageDraft[];
}

export interface QuoteLetterVariantDraft {
  key: string;
  name: string;
  subject: string;
  body: string;
}

export interface QuoteStaffContactDraft {
  userId: number;
  accountName: string;
  accountEmail: string;
  name: string;
  phone: string;
  email: string;
  /** Shown only; Gmail is connected with its own buttons, not saved with the page. */
  mailboxEmail: string;
}

export interface QuoteSettingsDraft {
  version: number;
  company: QuoteCompanyDraft;
  email: QuoteEmailTemplateDraft;
  pdf: QuotePdfTextsDraft;
  introduction: QuoteIntroductionDraft;
  letterVariants: QuoteLetterVariantDraft[];
  staffContacts: QuoteStaffContactDraft[];
}

/** Marks the email and PDF templates understand; the client ones come from the КП «Отримувач» and «Підприємство». */
export const quoteTemplateMarks = [
  '{quoteNumber}',
  '{clientName}',
  '{companyName}',
  '{managerName}',
  '{managerPhone}',
  '{managerEmail}',
  '{site}',
] as const;

export type QuoteTemplateMark = (typeof quoteTemplateMarks)[number];

/** Marks only the PDF opening text understands: they come from the КП items. */
export const quoteIntroMarks = [
  '{recipient}',
  '{sewingModel}',
  '{fabricName}',
  '{ppeItem}',
] as const;

export type QuoteIntroMark = (typeof quoteIntroMarks)[number];

/** Every mark a template can have; each field allows its own list. */
export type QuoteMark = QuoteTemplateMark | QuoteIntroMark;

/** The opening text understands its own marks and the common ones. */
export const quotePdfIntroMarks: readonly QuoteMark[] = [...quoteIntroMarks, ...quoteTemplateMarks];

/** Button names of the marks: «+ Номер КП» inserts `{quoteNumber}`. */
export const quoteTemplateMarkLabels: Readonly<Record<QuoteMark, string>> = {
  '{quoteNumber}': 'Номер КП',
  '{clientName}': 'Отримувач',
  '{companyName}': 'Підприємство',
  '{managerName}': 'Менеджер',
  '{managerPhone}': 'Телефон менеджера',
  '{managerEmail}': 'Email менеджера',
  '{site}': 'Сайт',
  '{recipient}': 'Для кого',
  '{sewingModel}': 'Модель',
  '{fabricName}': 'Тканина',
  '{ppeItem}': 'ЗІЗ',
};

export const quoteAdvantageCount = 5;
export const quoteMaxLetterVariants = 10;
