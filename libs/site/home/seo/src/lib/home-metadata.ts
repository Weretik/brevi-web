import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Home title and description per locale; the title already carries the brand, so no template is applied. */
export const HOME_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Пошиття спецодягу з логотипом від виробника — Brevi',
    description:
      'Brevi шиє спецодяг з логотипом вашої компанії на власному виробництві в Полтаві. Робочі костюми, куртки, футболки і поло оптом від 5 штук, з ПДВ.',
  },
  ru: {
    title: 'Пошив спецодежды с логотипом от производителя — Brevi',
    description:
      'Brevi шьёт спецодежду с логотипом вашей компании на собственном производстве в Полтаве. Рабочие костюмы, куртки, футболки и поло оптом от 5 штук, с НДС.',
  },
};

export function buildHomeMetadata(locale: Locale): Metadata {
  return buildPageMetadata({ locale, path: '/', ...HOME_SEO_TEXT[locale] });
}
