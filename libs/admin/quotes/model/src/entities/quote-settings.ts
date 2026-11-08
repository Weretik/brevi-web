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
  /** The opening text under the client name, one per КП composition; the server fills empty ones with the standard text. */
  intros: QuotePdfIntroTexts;
  /** The short fixed texts of the PDF; the server fills empty ones with the standard text. */
  labels: QuotePdfLabels;
  /** False leaves the client block («Для», company and recipient) out; the opening text then takes the full width. */
  showClient: boolean;
}

/** The 7 opening texts of the old calculator, chosen by what the КП holds (R-35). */
export interface QuotePdfIntroTexts {
  onePpe: string;
  oneSewing: string;
  oneSewingOnePpe: string;
  sewing: string;
  ppe: string;
  sewingAndPpe: string;
  fallback: string;
}

export interface QuotePdfLabels {
  contactLine: string;
  codeLabel: string;
  siteLink: string;
  fabricsTitle: string;
  recommended: string;
  commentTitle: string;
  /** The small heading over the client, «Для». */
  clientTitle: string;
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
