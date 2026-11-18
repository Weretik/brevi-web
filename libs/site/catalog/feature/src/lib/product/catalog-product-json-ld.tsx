import { buildCatalogProductJsonLd } from '@site/catalog/seo';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';

import type { CatalogProduct } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Structured data of the product page: the product with its offer, and the breadcrumbs. */
export function CatalogProductJsonLd({
  locale,
  product,
  categoryName,
  breadcrumbs,
}: {
  locale: Locale;
  product: CatalogProduct;
  categoryName: string | null;
  breadcrumbs: readonly { name: string; href: string }[];
}) {
  return (
    <>
      <JsonLd data={buildCatalogProductJsonLd(locale, product, categoryName)} />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </>
  );
}
