import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const CONTACTS_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Контакти виробника спецодягу в Полтаві',
    description:
      'Контакти Brevi: Полтава, вул. Кагамлика, 3А. Телефон 050 469 86 75, пошта pp.brevi@gmail.com. Працюємо Пн–Пт 9:00–18:00, доставляємо по всій Україні.',
  },
  ru: {
    title: 'Контакты производителя спецодежды в Полтаве',
    description:
      'Контакты Brevi: Полтава, ул. Кагамлыка, 3А. Телефон 050 469 86 75, почта pp.brevi@gmail.com. Работаем Пн–Пт 9:00–18:00, доставляем по всей Украине.',
  },
};

export function buildContactsMetadata(locale: Locale): Metadata {
  return buildPageMetadata({ locale, path: SITE_PATHS.contacts, ...CONTACTS_SEO_TEXT[locale] });
}
