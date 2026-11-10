import { getCatalogCategoryProducts } from '@site/catalog/data-access';
import { findCatalogPath } from '@site/catalog/model';
import {
  CatalogOrder,
  CatalogProductGrid,
  CatalogSubcategories,
  CatalogText,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import { SITE_PATHS, catalogCategoryPath, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';

import type { CatalogCategory } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Category page: breadcrumbs through the parent categories, subsections, every model of the category on one
 * page (the largest category has under a hundred), the client's text about the category, and the call to order.
 */
export async function CatalogCategoryPage({
  locale,
  category,
}: {
  locale: Locale;
  category: CatalogCategory;
}) {
  const dictionary = getCatalogDictionary(locale);
  const products = await getCatalogCategoryProducts(category);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const categoryHref = (slug: string) => localizedPath(locale, catalogCategoryPath(slug));
  const trail = findCatalogPath(category.slug) ?? [];
  const children = trail.at(-1)?.children ?? [];
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    ...trail.map((node) => ({ name: node.name[locale], href: categoryHref(node.slug) })),
  ];
  const text = category.text[locale];
  const name = category.name[locale];

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
        <CatalogProductGrid
          locale={locale}
          products={products}
          dictionary={dictionary.products}
          requestHref={path('request')}
        />
      </section>

      {text.length > 0 ? (
        <PageSection
          id="catalog-about"
          title={name}
          label={{ index: '02', text: dictionary.about.label }}
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
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
