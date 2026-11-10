import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const WORKS_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Наші роботи: приклади робочого одягу',
    description:
      'Фото робочого одягу, пошитого на виробництві Brevi в Полтаві: костюми, куртки, напівкомбінезони, жилети й кепки з логотипами підприємств-замовників.',
  },
  ru: {
    title: 'Наши работы: примеры рабочей одежды',
    description:
      'Фото рабочей одежды, сшитой на производстве Brevi в Полтаве: костюмы, куртки, полукомбинезоны, жилеты и кепки с логотипами предприятий-заказчиков.',
  },
};

export function buildWorksMetadata(locale: Locale): Metadata {
  return buildPageMetadata({ locale, path: SITE_PATHS.ourWork, ...WORKS_SEO_TEXT[locale] });
}
