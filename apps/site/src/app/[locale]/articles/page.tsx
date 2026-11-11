import { getArticles } from '@site/articles/data-access';
import { ArticlesPage } from '@site/articles/feature';
import { buildArticlesMetadata } from '@site/articles/seo';
import { isLocale } from '@site/core/i18n';
import { sitePageMetadata } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/articles'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? sitePageMetadata('articles', locale, buildArticlesMetadata(locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/articles'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ArticlesPage locale={locale} articles={await getArticles(locale)} />;
}
