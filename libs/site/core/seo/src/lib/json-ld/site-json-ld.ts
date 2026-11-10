import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { JsonLdData } from './json-ld';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

const organizationId = (config: SiteConfig) => `${config.siteUrl}/#organization`;

const postalAddress = (locale: Locale) => ({
  '@type': 'PostalAddress',
  streetAddress: COMPANY.address.street[locale],
  addressLocality: COMPANY.address.city[locale],
  addressCountry: COMPANY.address.countryCode,
});

/** Organization with the sales contacts; rendered once in the root layout. */
export function buildOrganizationJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const [salesPhone] = COMPANY.phones;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(config),
    name: COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    logo: `${config.siteUrl}${COMPANY.logo.path}`,
    email: COMPANY.email,
    telephone: salesPhone.e164,
    address: postalAddress(locale),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: salesPhone.e164,
      contactType: 'sales',
      areaServed: COMPANY.address.countryCode,
      availableLanguage: [...LOCALES],
    },
  };
}

/** WebSite for the home page of each language. A SearchAction is added when site search exists. */
export function buildWebSiteJsonLd(locale: Locale, config: SiteConfig = siteConfig): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    inLanguage: LOCALE_LANGUAGE_TAGS[locale],
    publisher: { '@id': organizationId(config) },
  };
}

/** The Poltava workshop as a LocalBusiness: address, the phone, and opening hours. Home and contacts use it. */
export function buildLocalBusinessJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const { days, opens, closes } = COMPANY.openingHours;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.siteUrl}/#local-business`,
    name: COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    image: `${config.siteUrl}${COMPANY.logo.path}`,
    email: COMPANY.email,
    telephone: COMPANY.phones.map((phone) => phone.e164),
    address: postalAddress(locale),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...days],
      opens,
      closes,
    },
    parentOrganization: { '@id': organizationId(config) },
  };
}
