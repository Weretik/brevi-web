import { getCatalogCategoryProducts } from '@site/catalog/data-access';
import { buildCatalogItemListJsonLd } from '@site/catalog/seo';
import {
  CatalogOrder,
  CatalogProductGrid,
  CatalogSubcategories,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import {
  SITE_PATHS,
  catalogCategoryPath,
  catalogProductPath,
  localizedPath,
} from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader } from '@site/shared/ui';

import type { CatalogCategory } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Category page: breadcrumbs through the product type, the sections of a type, every product of the category
 * on one page with its lowest price, and the call to order. Texts about a category come with «Контент → Розділи».
 */
export async function CatalogCategoryPage({
  locale,
  category,
}: {
  locale: Locale;
  category: CatalogCategory;
}) {
  const dictionary = getCatalogDictionary(locale);
  const products = await getCatalogCategoryProducts(category.node, locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const categoryHref = (slug: string) => localizedPath(locale, catalogCategoryPath(slug));
  const productHref = (slug: string) => localizedPath(locale, catalogProductPath(slug));
  const { node, trail } = category;
  const children = node.children;
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    ...trail.map((node) => ({ name: node.name[locale], href: categoryHref(node.slug) })),
  ];
  const name = node.name[locale];

  return (
    <div className="grid gap-10 pb-4 sm:gap-14">
      <div className="grid gap-6">
        <PageHeader
          breadcrumbs={breadcrumbs}
          breadcrumbsLabel={dictionary.breadcrumbsLabel}
          label={`${dictionary.label} · ${formatModelCount(locale, products.length)}`}
          title={name}
        />
        {children.length > 0 ? (
          <CatalogSubcategories
            locale={locale}
            categories={children}
            label={dictionary.subcategoriesLabel}
            categoryHref={categoryHref}
          />
        ) : null}
      </div>

      <section aria-label={dictionary.products.title}>
        {products.length > 0 ? (
          <CatalogProductGrid
            products={products}
            dictionary={dictionary.products}
            requestHref={path('request')}
            productHref={productHref}
          />
        ) : (
          <p className="max-w-[48rem] leading-relaxed text-muted-foreground">
            {dictionary.products.empty}
          </p>
        )}
      </section>

      <CatalogOrder
        id="catalog-order"
        index="02"
        dictionary={dictionary.order}
        requestHref={path('request')}
        logoHref={path('logoPrinting')}
        wholesaleHref={path('wholesale')}
      />

      <JsonLd
        data={buildCatalogItemListJsonLd(
          products.map((product) => ({
            name: product.name,
            path: productHref(product.slug),
          })),
        )}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
