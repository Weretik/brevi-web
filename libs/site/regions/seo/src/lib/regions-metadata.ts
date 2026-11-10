import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const REGIONS_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Спецодяг з доставкою по Україні від виробника',
    description:
      'Замовлення спецодягу з будь-якого міста України: Київ, Харків, Дніпро, Одеса, Запоріжжя, Львів. Пошиття в Полтаві, відправка Новою Поштою і САТ.',
  },
  ru: {
    title: 'Спецодежда с доставкой по Украине, производитель',
    description:
      'Заказ спецодежды из любого города Украины: Киев, Харьков, Днепр, Одесса, Запорожье, Львов. Пошив в Полтаве, отправка Новой Почтой и САТ.',
  },
};

export function buildRegionsMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.regions,
    ...REGIONS_SEO_TEXT[locale],
  });
}
