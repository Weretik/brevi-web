import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const PRODUCTION_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Власне виробництво спецодягу в Полтаві',
    description:
      'Власне швейне виробництво Brevi в Полтаві: погоджуємо модель і тканину, готуємо лекала, шиємо армованими нитками з посиленими швами, наносимо логотип.',
  },
  ru: {
    title: 'Собственное производство спецодежды в Полтаве',
    description:
      'Собственное швейное производство Brevi в Полтаве: согласовываем модель и ткань, готовим лекала, шьём армированными нитками с усиленными швами, наносим логотип.',
  },
};

export function buildProductionMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.production,
    ...PRODUCTION_SEO_TEXT[locale],
  });
}
