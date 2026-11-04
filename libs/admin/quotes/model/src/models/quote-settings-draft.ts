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
}

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

/** Marks the email and PDF templates understand. */
export const quoteTemplateMarks = [
  '{quoteNumber}',
  '{managerName}',
  '{managerPhone}',
  '{managerEmail}',
  '{site}',
] as const;

export const quoteAdvantageCount = 5;
export const quoteMaxLetterVariants = 10;
