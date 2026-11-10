import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const RETURNS_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Повернення та обмін спецодягу',
    description:
      'Політика повернення та обміну товару Brevi: 14 днів з моменту покупки, умови для повернення, дії у разі браку чи помилки, покрокова інструкція щодо обміну.',
  },
  ru: {
    title: 'Возврат и обмен спецодежды',
    description:
      'Политика возврата и обмена товара Brevi: 14 дней с момента покупки, условия возврата, действия в случае брака или ошибки, пошаговая инструкция по обмену.',
  },
};

export function buildReturnsMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.returnsExchanges,
    ...RETURNS_SEO_TEXT[locale],
  });
}
