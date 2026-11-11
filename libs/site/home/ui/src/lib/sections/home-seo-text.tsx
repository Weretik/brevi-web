import { CatalogText } from '@site/catalog/ui';
import { FaqList } from '@site/shared/ui';

import type { HomeDictionary } from '../i18n/home-dictionary';
import type { CatalogTextBlock } from '@site/catalog/model';
import type { FaqListItem } from '@site/shared/ui';

/**
 * SEO text on the left and the FAQ on the right; the FAQ is plain `<details>`, readable without JavaScript. Text
 * and questions staff saved in «Сторінки сайту» replace the dictionary ones.
 */
export function HomeSeoText({
  dictionary,
  text,
  faq,
}: {
  dictionary: HomeDictionary['seo'];
  /** Main text from the Admin; the dictionary text when empty. */
  text: readonly CatalogTextBlock[];
  faq: readonly FaqListItem[];
}) {
  return (
    <section
      aria-labelledby="home-seo-title"
      className="grid gap-x-12 gap-y-8 border-t border-border pt-10 lg:grid-cols-2"
    >
      <article className="grid content-start gap-4">
        <h2 id="home-seo-title" className="text-[1.375rem] leading-tight font-extrabold">
          {dictionary.title}
        </h2>
        {text.length > 0 ? (
          <CatalogText blocks={text} className="max-w-none" />
        ) : (
          <>
            <p className="leading-relaxed text-muted-foreground">{dictionary.intro}</p>
            {dictionary.blocks.map((block) => (
              <div key={block.title} className="grid gap-1.5">
                <h3 className="font-extrabold">{block.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>
              </div>
            ))}
          </>
        )}
      </article>
      <div className="grid content-start gap-2.5">
        <h2 className="mb-1.5 text-[1.375rem] leading-tight font-extrabold">
          {dictionary.faqTitle}
        </h2>
        <FaqList items={faq} />
      </div>
    </section>
  );
}
