import { getCatalogCategoryProducts } from '@site/catalog/data-access';
import { buildCatalogItemListJsonLd } from '@site/catalog/seo';
import {
  CatalogOrder,
  CatalogProductGrid,
  CatalogSubcategories,
  CatalogText,
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
import { PageHeader, PageSection } from '@site/shared/ui';

import type { CatalogCategoryPage as CatalogCategoryPageData } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Category page: breadcrumbs through the top-level category, the subcategories, every product of the
 * category on one page with its lowest price, the text staff wrote about the category, and the call to order.
 */
export async function CatalogCategoryPage({
  locale,
  category,
}: {
  locale: Locale;
  category: CatalogCategoryPageData;
}) {
  const dictionary = getCatalogDictionary(locale);
  const products = await getCatalogCategoryProducts(category.node.slug, locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const categoryHref = (slug: string) => localizedPath(locale, catalogCategoryPath(slug));
  const productHref = (slug: string) => localizedPath(locale, catalogProductPath(slug));
  const { node, trail, text } = category;
  const children = node.children;
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    ...trail.map((node) => ({ name: node.name[locale], href: categoryHref(node.slug) })),
  ];
  const name = category.name;

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

      {text.length > 0 ? (
        <PageSection
          id="catalog-about"
          title={dictionary.about.label}
          label={{ index: '02', text: dictionary.label }}
        >
          <CatalogText blocks={text} />
        </PageSection>
      ) : null}

      <CatalogOrder
        id="catalog-order"
        index={text.length > 0 ? '03' : '02'}
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
