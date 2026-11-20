import { CatalogProductCarousel, getCatalogDictionary } from '@site/catalog/ui';
import { catalogProductPath, localizedPath } from '@site/core/i18n';
import { PageSection } from '@site/shared/ui';

import type { CatalogProductCard } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** The models carousel of a city page; «Купити» on a card opens the request window with that model. */
export function CityProductsSection({
  locale,
  index,
  title,
  label,
  all,
  products,
  requestHref,
}: {
  locale: Locale;
  index: string;
  title: string;
  label: string;
  /** «Весь каталог» on the right of the heading. */
  all: { href: string; label: string };
  products: readonly CatalogProductCard[];
  requestHref: string;
}) {
  const catalogText = getCatalogDictionary(locale);
  return (
    <PageSection id="city-products" title={title} label={{ index, text: label }} action={all}>
      <CatalogProductCarousel
        items={products.map((product) => ({
          product,
          href: localizedPath(locale, catalogProductPath(product.slug)),
        }))}
        dictionary={catalogText.products}
        requestHref={requestHref}
        labels={catalogText.carousel}
      />
    </PageSection>
  );
}
