import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const INDUSTRIES_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Спецодяг для підприємств — пошиття та брендування',
    description:
      'Пошиття спецодягу для підприємств від 5 виробів: куртки, штани, жилети, напівкомбінезони. Нанесення логотипа, ПДВ і доставка по Україні.',
  },
  ru: {
    title: 'Спецодежда для предприятий — пошив, брендирование',
    description:
      'Пошив спецодежды для предприятий от 5 изделий: куртки, брюки, жилеты, полукомбинезоны. Нанесение логотипа, НДС и доставка по Украине.',
  },
};

export function buildIndustriesMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.industries,
    ...INDUSTRIES_SEO_TEXT[locale],
  });
}
