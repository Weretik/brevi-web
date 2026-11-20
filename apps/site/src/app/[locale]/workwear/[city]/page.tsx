import { getCatalogProducts } from '@site/catalog/data-access';
import { WorkwearCityPage } from '@site/cities/feature';
import { CITIES, cityPageProducts, findCity } from '@site/cities/model';
import { buildCityMetadata } from '@site/cities/seo';
import { cityPagePath, isLocale, localizedPath } from '@site/core/i18n';
import { redirectOrNotFound } from '@site/redirects/data-access';
import { withSiteSharePicture } from '@site/settings/data-access';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

/** «Робочий одяг» page of each of the 13 cities, built ahead; another slug follows «Переадресації» or answers 404. */
export function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/workwear/[city]'>): Promise<Metadata> {
  const { locale, city } = await params;
  return isLocale(locale) && findCity(city)
    ? withSiteSharePicture(buildCityMetadata('workwear', city, locale))
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/workwear/[city]'>) {
  const { locale, city: slug } = await params;
  if (!isLocale(locale)) notFound();
  const city = findCity(slug);
  if (!city) return redirectOrNotFound(localizedPath(locale, cityPagePath('workwear', slug)));

  const products = await getCatalogProducts(locale);
  return (
    <WorkwearCityPage
      locale={locale}
      city={city}
      products={cityPageProducts('workwear', products)}
    />
  );
}
