import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { JsonLdData } from './json-ld';
import type { Company, SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

const organizationId = (config: SiteConfig) => `${config.siteUrl}/#organization`;

const postalAddress = (locale: Locale, company: Company) => ({
  '@type': 'PostalAddress',
  streetAddress: company.address.street[locale],
  addressLocality: company.address.city[locale],
  addressCountry: company.address.countryCode,
});

/** Organization with the sales contacts; rendered once in the root layout. */
export function buildOrganizationJsonLd(
  locale: Locale,
  company: Company,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const [salesPhone] = company.phones;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(config),
    name: company.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    logo: `${config.siteUrl}${company.logo.path}`,
    email: company.email,
    telephone: salesPhone.e164,
    address: postalAddress(locale, company),
    areaServed: { '@type': 'Country', name: company.address.countryCode },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: salesPhone.e164,
      contactType: 'sales',
      areaServed: company.address.countryCode,
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
  company: Company,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const { days, opens, closes } = company.openingHours;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.siteUrl}/#local-business`,
    name: company.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    image: `${config.siteUrl}${company.logo.path}`,
    email: company.email,
    telephone: company.phones.map((phone) => phone.e164),
    address: postalAddress(locale, company),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...days],
      opens,
      closes,
    },
    parentOrganization: { '@id': organizationId(config) },
  };
}
