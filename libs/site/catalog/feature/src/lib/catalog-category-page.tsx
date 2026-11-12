import { getCatalogCategoryProducts } from '@site/catalog/data-access';
import { catalogCategoryFamily } from '@site/catalog/model';
import { buildCatalogItemListJsonLd } from '@site/catalog/seo';
import {
  CatalogCategoryTabs,
  CatalogExpandableText,
  CatalogListing,
  CatalogOrder,
  CatalogSearchBox,
  CatalogText,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import {
  SITE_PATHS,
  catalogCategoryPath,
  catalogProductPath,
  catalogSearchIndexPath,
  localizedPath,
} from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageHeader, PageSection } from '@site/shared/ui';

import type { CatalogCategoryPage as CatalogCategoryPageData } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Category page: breadcrumbs, the heading with the number of models and the search, the subcategories as
 * tabs (on a subcategory: its neighbours, so the visitor can move between them), every product of the
 * category with the price and kind filters and the order, the text staff wrote folded to its first lines,
 * and the call to order.
 */
export async function CatalogCategoryPage({
  locale,
  category,
}: {
  locale: Locale;
  category: CatalogCategoryPageData;
}) {
  const company = await loadSiteCompany();
  const dictionary = getCatalogDictionary(locale);
  const products = await getCatalogCategoryProducts(category.node.slug, locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const categoryHref = (slug: string) => localizedPath(locale, catalogCategoryPath(slug));
  const productHref = (slug: string) => localizedPath(locale, catalogProductPath(slug));
  const { node, trail, text } = category;
  const family = catalogCategoryFamily(trail);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    ...trail.map((node) => ({ name: node.name[locale], href: categoryHref(node.slug) })),
  ];
  const tab = (item: (typeof trail)[number]) => ({
    slug: item.slug,
    name: item.name[locale],
    count: item.productCount,
  });

  return (
    <div className="grid gap-8 pb-4 sm:gap-12">
      <div className="grid gap-5">
        <PageHeader
          breadcrumbs={breadcrumbs}
          breadcrumbsLabel={dictionary.breadcrumbsLabel}
          title={category.name}
          titleNote={formatModelCount(locale, products.length)}
        />
        <CatalogSearchBox
          indexUrl={catalogSearchIndexPath(locale)}
          action={path('search')}
          text={dictionary.search}
          size="compact"
          className="max-w-[30rem]"
        />
      </div>

      <section aria-label={dictionary.products.title} className="grid gap-3">
        {family ? (
          <CatalogCategoryTabs
            parent={tab(family.parent)}
            items={family.items.map(tab)}
            current={node.slug}
            label={dictionary.listing.tabs}
            allLabel={dictionary.listing.all}
            categoryHref={categoryHref}
          />
        ) : null}
        {products.length > 0 ? (
          <CatalogListing
            items={products.map((product) => ({ product, href: productHref(product.slug) }))}
            products={dictionary.products}
            text={dictionary.listing}
            requestHref={path('request')}
          />
        ) : (
          <p className="max-w-[48rem] leading-relaxed text-muted-foreground">
            {dictionary.products.empty}
          </p>
        )}
      </section>

      {text.length > 0 ? (
        <PageSection id="catalog-about" title={dictionary.about.label}>
          <CatalogExpandableText
            more={dictionary.product.description.more}
            less={dictionary.product.description.less}
          >
            <CatalogText blocks={text} />
          </CatalogExpandableText>
        </PageSection>
      ) : null}

      <CatalogOrder
        company={company}
        id="catalog-order"
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
