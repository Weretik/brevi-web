import { formatArticleDate } from '@site/articles/model';
import Link from 'next/link';

import type { Article } from '@site/articles/model';
import type { Locale } from '@site/core/i18n';

/**
 * Article cards: date, title, excerpt, and «Читати». The whole card is one link through the title, so a
 * screen reader hears each article once. `headingLevel` follows the block the cards stand in.
 */
export function ArticleCards({
  articles,
  locale,
  readLabel,
  hrefFor,
  headingLevel = 3,
}: {
  articles: readonly Article[];
  locale: Locale;
  readLabel: string;
  /** Localized link of an article, built by the feature from the site paths. */
  hrefFor: (article: Article) => string;
  headingLevel?: 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <article className="relative grid h-full content-start gap-3 rounded-lg border border-border bg-background p-5 hover:border-brand sm:p-6">
            <time
              dateTime={article.date}
              className="font-mono text-[0.8125rem] text-muted-foreground"
            >
              {formatArticleDate(article.date)}
            </time>
            <Heading className="text-lg leading-snug font-bold">
              <Link href={hrefFor(article)} className="after:absolute after:inset-0">
                {article.title[locale]}
              </Link>
            </Heading>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              {article.excerpt[locale]}
            </p>
            <p aria-hidden className="mt-auto pt-1 font-bold text-brand-text">
              {readLabel} →
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
