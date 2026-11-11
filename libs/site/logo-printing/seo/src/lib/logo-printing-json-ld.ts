import { COMPANY, siteConfig } from '@site/core/config';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { buildOrganizationJsonLd } from '@site/core/seo';

import { LOGO_PRINTING_SEO_TEXT } from './logo-printing-metadata';

import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

/** `Service` for the logo branding page: what is offered, by whom, and where it is delivered. */
export function buildLogoPrintingServiceJsonLd(locale: Locale): JsonLdData {
  const { title, description } = LOGO_PRINTING_SEO_TEXT[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    serviceType: locale === 'uk' ? 'Брендування спецодягу' : 'Брендирование спецодежды',
    url: `${siteConfig.siteUrl}${localizedPath(locale, SITE_PATHS.logoPrinting)}`,
    provider: { '@id': buildOrganizationJsonLd(locale, COMPANY)['@id'] },
    areaServed: { '@type': 'Country', name: 'UA' },
  };
}
