import { ArticleCards, getArticlesDictionary } from '@site/articles/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';

import { articleHref } from './article-links';

import type { ArticleCard } from '@site/articles/model';
import type { Locale } from '@site/core/i18n';

/**
 * «Статті» list: every article staff show on the site, newest first, as a card. No pagination. While the
 * Admin has no articles or the API is unavailable, the page says that the articles will appear later.
 */
export function ArticlesPage({
  locale,
  articles,
}: {
  locale: Locale;
  articles: readonly ArticleCard[];
}) {
  const dictionary = getArticlesDictionary(locale);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.articles) },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={dictionary.breadcrumbsLabel}
        label={dictionary.label}
        title={dictionary.title}
        lead={dictionary.lead}
      />

      <PageSection
        id="articles-list"
        title={dictionary.list.title}
        label={{ index: '02', text: dictionary.list.label }}
      >
        {articles.length > 0 ? (
          <ArticleCards
            articles={articles}
            readLabel={dictionary.list.read}
            hrefFor={(article) => articleHref(locale, article)}
          />
        ) : (
          <p className="text-muted-foreground">{dictionary.list.empty}</p>
        )}
      </PageSection>

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
