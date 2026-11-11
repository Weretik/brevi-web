import { getArticle, getArticleAddresses, getArticles } from '@site/articles/data-access';
import { ArticlePage, toArticleSeoInput } from '@site/articles/feature';
import { pickMoreArticles } from '@site/articles/model';
import { buildArticleMetadata } from '@site/articles/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/**
 * Articles come from the Admin, so a new one opens without a rebuild: it is rendered on the first visit
 * and kept in the cache. A slug the site does not show is a real 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const addresses = await getArticleAddresses();
  return addresses.map((address) => ({ slug: address.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/articles/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = isLocale(locale) ? await getArticle(slug, locale) : null;
  return isLocale(locale) && article
    ? buildArticleMetadata(locale, toArticleSeoInput(article))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/articles/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [article, articles] = await Promise.all([getArticle(slug, locale), getArticles(locale)]);
  if (!article) notFound();

  return <ArticlePage locale={locale} article={article} more={pickMoreArticles(articles, slug)} />;
}
