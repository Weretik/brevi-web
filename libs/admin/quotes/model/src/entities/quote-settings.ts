/** Requisites and contacts of Brevi printed in every КП. */
export interface QuoteCompany {
  name: string;
  edrpou: string | null;
  taxId: string | null;
  iban: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  site: string | null;
  logoUrl: string | null;
}

export interface QuoteEmailTemplate {
  subject: string;
  body: string;
}

export interface QuotePdfTexts {
  title: string;
  vatNotice: string | null;
  ctaTitle: string | null;
  ctaText: string | null;
  ctaContactTemplate: string | null;
  /** The opening text under the client name; `{client}` is the client. Null means the standard text. */
  introText: string | null;
}

export interface QuoteAdvantage {
  title: string;
  text: string | null;
}

/** «КП для знайомства — рекламний каталог» texts and the main model codes of the season pages. */
export interface QuoteIntroductionTexts {
  logoText: string | null;
  summerTitle: string | null;
  winterTitle: string | null;
  subtitle: string | null;
  summerBannerUrl: string | null;
  winterBannerUrl: string | null;
  modelsTitle: string | null;
  assortmentLinkText: string | null;
  assortmentUrl: string | null;
  productButtonText: string | null;
  nextStepText: string | null;
  accentColor: string | null;
  /** Main summer model; null means MOD-166 «Імпульс». */
  summerMainCode: string | null;
  /** Main winter model; null means MOD-169 «Прайм». */
  winterMainCode: string | null;
  advantages: QuoteAdvantage[];
}

export interface QuoteLetterVariant {
  name: string;
  subject: string;
  body: string;
}

/** What the client sees about a staff member; the account name and email are for orientation only. */
export interface QuoteStaffContact {
  userId: number;
  accountName: string;
  accountEmail: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  /** The connected Gmail КП are sent from; null until connected. */
  mailboxEmail: string | null;
}

/** «Налаштування КП»; version 0 means nothing was saved yet and the defaults are shown. */
export interface QuoteSettings {
  version: number;
  updatedByName: string | null;
  updatedAt: string | null;
  company: QuoteCompany;
  email: QuoteEmailTemplate;
  pdf: QuotePdfTexts;
  introduction: QuoteIntroductionTexts;
  letterVariants: QuoteLetterVariant[];
  staffContacts: QuoteStaffContact[];
}
