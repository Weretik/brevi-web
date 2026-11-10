import { articlePath } from '@site/articles/seo';
import { localizedPath } from '@site/core/i18n';

import type { Article, ArticleBlock } from '@site/articles/model';
import type { ArticleSeoInput } from '@site/articles/seo';
import type { Locale } from '@site/core/i18n';

/** Localized link of an article page. */
export function articleHref(locale: Locale, article: Article): string {
  return localizedPath(locale, articlePath(article.slug));
}

/** The values the SEO builders need from an article, in one language. */
export function toArticleSeoInput(locale: Locale, article: Article): ArticleSeoInput {
  const image = article.body[locale].find(
    (block): block is Extract<ArticleBlock, { type: 'image' }> => block.type === 'image',
  );

  return {
    slug: article.slug,
    title: article.title[locale],
    description: article.excerpt[locale],
    date: article.date,
    image: image?.src,
  };
}
