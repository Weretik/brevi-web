import { ARTICLES, formatArticleDate } from '@site/articles/model';
import { buildArticleJsonLd } from '@site/articles/seo';
import { ArticleBody, ArticleCards, ArticlesOrder, getArticlesDictionary } from '@site/articles/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { Breadcrumbs, PageSection, StitchLabel } from '@site/shared/ui';

import { articleHref, toArticleSeoInput } from './article-links';

import type { Article } from '@site/articles/model';
import type { Locale } from '@site/core/i18n';

/** Anchor of the home contacts block; «Обговорити пошиття» leads there until the request page exists. */
const REQUEST_ANCHOR = '#zayavka';

/** How many other articles the «Читайте також» block offers. */
const MORE_ARTICLES = 3;

/** The articles that follow this one in the list, wrapping around, so every article gets linked. */
function pickMoreArticles(article: Article): readonly Article[] {
  const start = ARTICLES.findIndex((item) => item.slug === article.slug) + 1;
  return Array.from(
    { length: MORE_ARTICLES },
    (_, offset) => ARTICLES[(start + offset) % ARTICLES.length],
  ).filter((item) => item.slug !== article.slug);
}

/**
 * One article: breadcrumbs, date, `h1`, the text, the call to order, and three more articles. Static.
 * `Article` and `BreadcrumbList` describe the page in JSON-LD.
 */
export function ArticlePage({ locale, article }: { locale: Locale; article: Article }) {
  const dictionary = getArticlesDictionary(locale);
  const title = article.title[locale];
  const articlesHref = localizedPath(locale, SITE_PATHS.articles);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: articlesHref },
    { name: title, href: articleHref(locale, article) },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <article className="grid gap-8 pt-6 sm:pt-8">
        <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
        <header className="grid gap-5">
          <StitchLabel index="01">{dictionary.breadcrumb}</StitchLabel>
          <h1 className="max-w-[52rem] text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.5rem]">
            {title}
          </h1>
          <p className="font-mono text-[0.8125rem] text-muted-foreground">
            {dictionary.article.published}{' '}
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          </p>
        </header>
        <ArticleBody blocks={article.body[locale]} />
      </article>

      <ArticlesOrder
        id="article-order"
        dictionary={dictionary.article.order}
        discussHref={`${localizedPath(locale)}${REQUEST_ANCHOR}`}
        productionHref={localizedPath(locale, SITE_PATHS.production)}
      />

      <PageSection
        id="article-more"
        title={dictionary.article.more.title}
        label={{ index: '02', text: dictionary.article.more.label }}
        action={{ href: articlesHref, label: dictionary.article.more.all }}
      >
        <ArticleCards
          articles={pickMoreArticles(article)}
          locale={locale}
          readLabel={dictionary.list.read}
          hrefFor={(item) => articleHref(locale, item)}
        />
      </PageSection>

      <JsonLd data={buildArticleJsonLd(locale, toArticleSeoInput(locale, article))} />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
