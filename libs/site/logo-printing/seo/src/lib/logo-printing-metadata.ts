import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const LOGO_PRINTING_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Нанесення логотипу на спецодяг, брендування',
    description:
      'Брендування спецодягу Brevi: вишивка, термотрансфер, шовкодрук. Пошиття корпоративного спецодягу з логотипом від 5 штук, 2–4 тижні, доставка по Україні.',
  },
  ru: {
    title: 'Нанесение логотипа на спецодежду, брендирование',
    description:
      'Брендирование спецодежды Brevi: вышивка, термотрансфер, шелкография. Пошив корпоративной спецодежды с логотипом от 5 штук, 2–4 недели, доставка по Украине.',
  },
};

export function buildLogoPrintingMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.logoPrinting,
    ...LOGO_PRINTING_SEO_TEXT[locale],
  });
}
