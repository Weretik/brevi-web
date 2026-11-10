import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const DELIVERY_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Доставка та оплата спецодягу по Україні',
    description:
      'Доставка спецодягу Brevi Новою Поштою та САТ по Україні, відправка до 3 робочих днів. Самовивіз у Полтаві безкоштовно. Оплата на рахунок, працюємо з ПДВ.',
  },
  ru: {
    title: 'Доставка и оплата спецодежды по Украине',
    description:
      'Доставка спецодежды Brevi Новой Почтой и САТ по Украине, отправка до 3 рабочих дней. Самовывоз в Полтаве бесплатно. Оплата на счёт, работаем с НДС.',
  },
};

export function buildDeliveryMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.deliveryAndPayment,
    ...DELIVERY_SEO_TEXT[locale],
  });
}
