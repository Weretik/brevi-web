import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const CERTIFICATES_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Сертифікати на робочий одяг',
    description:
      'Сертифікати експертизи типу, декларації про відповідність Технічному регламенту та висновки санітарно-епідеміологічної експертизи на робочий одяг Brevi.',
  },
  ru: {
    title: 'Сертификаты на рабочую одежду',
    description:
      'Сертификаты экспертизы типа, декларации о соответствии Техническому регламенту и заключения санитарно-эпидемиологической экспертизы на рабочую одежду Brevi.',
  },
};

export function buildCertificatesMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.certificates,
    ...CERTIFICATES_SEO_TEXT[locale],
  });
}
