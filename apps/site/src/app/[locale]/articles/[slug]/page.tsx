import { ArticlePage, toArticleSeoInput } from '@site/articles/feature';
import { ARTICLES, findArticle } from '@site/articles/model';
import { buildArticleMetadata } from '@site/articles/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/** Only the listed articles exist; any other slug is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/articles/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = findArticle(slug);
  return isLocale(locale) && article
    ? buildArticleMetadata(locale, toArticleSeoInput(locale, article))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/articles/[slug]'>) {
  const { locale, slug } = await params;
  const article = findArticle(slug);
  if (!isLocale(locale) || !article) notFound();

  return <ArticlePage locale={locale} article={article} />;
}
