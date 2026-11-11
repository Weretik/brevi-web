import { formatArticleDate } from '@site/articles/model';
import Image from 'next/image';
import Link from 'next/link';

import type { ArticleCard } from '@site/articles/model';

/**
 * Article cards: cover, date, title, excerpt, and «Читати». The whole card is one link through the title,
 * so a screen reader hears each article once. `headingLevel` follows the block the cards stand in.
 */
export function ArticleCards({
  articles,
  readLabel,
  hrefFor,
  headingLevel = 3,
}: {
  articles: readonly ArticleCard[];
  readLabel: string;
  /** Localized link of an article, built by the feature from the site paths. */
  hrefFor: (article: ArticleCard) => string;
  headingLevel?: 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background hover:border-brand">
            {article.cover ? (
              <div className="relative aspect-[16/10] border-b border-border bg-muted">
                <Image
                  src={article.cover.thumbnail ?? article.cover.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="grid flex-1 content-start gap-3 p-5 sm:p-6">
              <time
                dateTime={article.date}
                className="font-mono text-[0.8125rem] text-muted-foreground"
              >
                {formatArticleDate(article.date)}
              </time>
              <Heading className="text-lg leading-snug font-bold">
                <Link href={hrefFor(article)} className="after:absolute after:inset-0">
                  {article.title}
                </Link>
              </Heading>
              {article.excerpt ? (
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              ) : null}
              <p aria-hidden className="mt-auto pt-1 font-bold text-brand-text">
                {readLabel} →
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
