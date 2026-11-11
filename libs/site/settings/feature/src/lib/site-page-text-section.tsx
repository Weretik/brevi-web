import { CatalogText } from '@site/catalog/ui';
import { JsonLd, buildFaqPageJsonLd } from '@site/core/seo';
import { loadSitePageText } from '@site/settings/data-access';
import { FaqList } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

const FAQ_TITLE: Record<Locale, string> = { uk: 'Часті запитання', ru: 'Частые вопросы' };
const TEXT_LABEL: Record<Locale, string> = { uk: 'Про сторінку', ru: 'О странице' };

/**
 * The main text and frequent questions staff wrote for a fixed page in «Контент → Сторінки сайту» (CNT-010), at the
 * bottom of the page, with `FAQPage` for the same questions. Nothing while staff wrote neither.
 */
export async function SitePageTextSection({
  pageKey,
  locale,
}: {
  /** Key of the page in «Сторінки сайту», for example `wholesale`. */
  pageKey: string;
  locale: Locale;
}) {
  const saved = await loadSitePageText(pageKey, locale);
  if (!saved || (saved.text.length === 0 && saved.faq.length === 0)) return null;
  const faqTitleId = `${pageKey}-faq-title`;

  return (
    <div className="mt-14 grid gap-10 border-t border-border pt-10 pb-4 sm:mt-16">
      {saved.text.length > 0 && (
        <section aria-label={TEXT_LABEL[locale]}>
          <CatalogText blocks={saved.text} />
        </section>
      )}
      {saved.faq.length > 0 && (
        <section aria-labelledby={faqTitleId} className="grid gap-4">
          <h2 id={faqTitleId} className="text-[1.375rem] leading-tight font-extrabold">
            {FAQ_TITLE[locale]}
          </h2>
          <FaqList items={saved.faq} className="max-w-[52rem]" />
          <JsonLd data={buildFaqPageJsonLd(saved.faq)} />
        </section>
      )}
    </div>
  );
}
