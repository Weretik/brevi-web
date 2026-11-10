import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const REQUEST_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Залишити заявку на спецодяг',
    description:
      'Залиште номер телефону, і менеджер Brevi зателефонує, уточнить деталі та підготує попередній розрахунок. Замовлення від 5 виробів.',
  },
  ru: {
    title: 'Оставить заявку на спецодежду',
    description:
      'Оставьте номер телефона, и менеджер Brevi перезвонит, уточнит детали и подготовит предварительный расчёт. Заказ от 5 изделий.',
  },
};

/** The request page is a utility page: `noindex, follow`, and it stays out of the sitemap. */
export function buildRequestMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.request,
    indexable: false,
    ...REQUEST_SEO_TEXT[locale],
  });
}
