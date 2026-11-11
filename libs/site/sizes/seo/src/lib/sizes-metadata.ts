import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const SIZES_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Таблиця розмірів спецодягу та спецвзуття',
    description:
      'Таблиця розмірів спецодягу та взуття Brevi: розмір за обхватом грудей, зріст, розмір взуття за довжиною стопи, калькулятор підбору та правила вимірювання.',
  },
  ru: {
    title: 'Таблица размеров спецодежды и спецобуви',
    description:
      'Таблица размеров спецодежды и обуви Brevi: размер по обхвату груди, рост, размер обуви по длине стопы, калькулятор подбора и правила измерения.',
  },
};

export function buildSizesMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.sizeChart,
    ...SIZES_SEO_TEXT[locale],
  });
}
