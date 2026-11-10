import { SITE_PATHS } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Title and description per locale; the layout template adds « — Brevi» to the title. */
export const AGREEMENT_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Договір публічної оферти купівлі-продажу',
    description:
      'Договір публічної оферти ПП «Бреві»: оформлення замовлення, ціни та оплата, доставка, повернення і обмін товарів, гарантії, реквізити продавця.',
  },
  ru: {
    title: 'Договор публичной оферты купли-продажи',
    description:
      'Договор публичной оферты ЧП «Бреви»: оформление заказа, цены и оплата, доставка, возврат и обмен товаров, гарантии, реквизиты продавца.',
  },
};

export function buildAgreementMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    path: SITE_PATHS.agreement,
    ...AGREEMENT_SEO_TEXT[locale],
  });
}
