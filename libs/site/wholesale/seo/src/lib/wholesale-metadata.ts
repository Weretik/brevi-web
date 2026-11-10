import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const WHOLESALE_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Спецодяг оптом від виробника, ціни для опту',
    description:
      'Спецодяг оптом від виробника Brevi: три рівні цін залежно від кількості, пошиття від 5 штук, логотип підприємства, робота з ПДВ, доставка по Україні.',
  },
  ru: {
    title: 'Спецодежда оптом от производителя, цены',
    description:
      'Спецодежда оптом от производителя Brevi: три уровня цен в зависимости от количества, пошив от 5 штук, логотип предприятия, работа с НДС, доставка по Украине.',
  },
};

export function buildWholesaleMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.wholesale,
    ...WHOLESALE_SEO_TEXT[locale],
  });
}
