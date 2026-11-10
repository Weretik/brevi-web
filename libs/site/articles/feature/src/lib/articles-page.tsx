import { ARTICLES } from '@site/articles/model';
import { ArticleCards, getArticlesDictionary } from '@site/articles/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';

import { articleHref } from './article-links';

import type { Locale } from '@site/core/i18n';

/** «Статті» list: every article of the blog as a card, newest first. Static, no pagination. */
export function ArticlesPage({ locale }: { locale: Locale }) {
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
        <ArticleCards
          articles={ARTICLES}
          locale={locale}
          readLabel={dictionary.list.read}
          hrefFor={(article) => articleHref(locale, article)}
        />
      </PageSection>

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
