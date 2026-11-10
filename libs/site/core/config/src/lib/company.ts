type Localized = { uk: string; ru: string };

export type CompanyPhone = {
  /** `tel:` value in E.164. */
  e164: string;
  /** The number as the header and footer show it. */
  display: string;
};

export type CompanyOpeningHours = {
  /** schema.org day names for `OpeningHoursSpecification`. */
  days: readonly string[];
  opens: string;
  closes: string;
  /** The same hours as the header shows them. */
  label: Localized;
};

export type CompanySocial = {
  key: 'instagram' | 'youtube' | 'facebook';
  label: string;
  /** Profile address; `null` until the owner gives it, and the footer then shows the name without a link. */
  url: string | null;
};

/**
 * Fixed company facts shown in the header, footer, and structured data.
 * They move to BreviERP when the admin gets a contacts form; until then this is the only place that holds them.
 */
export const COMPANY = {
  name: 'Brevi',
  /** Logo for light backgrounds in `apps/site/public`, with its pixel size for `next/image`. */
  logo: { path: '/assets/logo/brevi-logo-dark.png', width: 1401, height: 725 },
  email: 'pp.brevi@gmail.com',
  /** The sales phone first: it is the header button and the `ContactPoint`. */
  phones: [
    { e164: '+380504698675', display: '050 469 86 75' },
    { e164: '+380532671109', display: '0532 67 11 09' },
  ] as readonly [CompanyPhone, CompanyPhone],
  address: {
    countryCode: 'UA',
    city: { uk: 'Полтава', ru: 'Полтава' } as Localized,
    street: { uk: 'вул. Кагамлика, 3А', ru: 'ул. Кагамлыка, 3А' } as Localized,
  },
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
    label: { uk: 'Пн–Пт 9:00–18:00', ru: 'Пн–Пт 9:00–18:00' },
  } as CompanyOpeningHours,
  /** Payment details from the live «Доставка та оплата» page. */
  bankDetails: {
    recipient: {
      uk: 'Приватне підприємство «Бреві»',
      ru: 'Частное предприятие «Бреви»',
    } as Localized,
    edrpou: '35521636',
    iban: 'UA63 305299 00000 26004041206862',
    bank: { uk: 'АТ КБ «ПриватБанк»', ru: 'АО КБ «ПриватБанк»' } as Localized,
  },
  /** The networks the live site lists; addresses are not known yet. */
  socials: [
    { key: 'instagram', label: 'Instagram', url: null },
    { key: 'youtube', label: 'YouTube', url: null },
    { key: 'facebook', label: 'Facebook', url: null },
  ] as readonly CompanySocial[],
} as const;
