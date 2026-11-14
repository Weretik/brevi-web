import {
  getCatalogCategoryProducts,
  getCatalogProductAddresses,
  getCatalogTree,
} from '@site/catalog/data-access';
import {
  CatalogOrder,
  CatalogSearchBox,
  CatalogSectionGroups,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import {
  SITE_PATHS,
  catalogCategoryPath,
  catalogSearchIndexPath,
  localizedPath,
} from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageHeader } from '@site/shared/ui';

import type { CatalogSectionGroup, CatalogSectionTile } from '@site/catalog/ui';
import type { Locale } from '@site/core/i18n';

/**
 * Catalog root: the search, the categories in two groups («Власне пошиття», then «Засоби захисту») with
 * their lowest price and subcategories, and the call to order. A category goes to the group most of its
 * models belong to. While the catalog is empty or unavailable the page keeps its heading, the search, and
 * the call to order.
 */
export async function CatalogRootPage({ locale }: { locale: Locale }) {
  const company = await loadSiteCompany();
  const [tree, products] = await Promise.all([getCatalogTree(), getCatalogProductAddresses()]);
  const dictionary = getCatalogDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
  ];
  // A product may be in several categories, so the models are counted once, by their own addresses.
  const total = tree.length > 0 ? products.length : 0;

  // The cards of each top-level category tell its kind and its lowest price; the answers are cached.
  const cards = await Promise.all(
    tree.map((node) => getCatalogCategoryProducts(node.slug, locale)),
  );
  const groups: CatalogSectionGroup[] = (['Sewing', 'Ppe'] as const)
    .map((type) => ({
      type,
      sections: tree.flatMap((node, index): CatalogSectionTile[] => {
        const own = cards[index].filter((card) => card.type === 'Sewing').length;
        const kind = own * 2 >= cards[index].length ? 'Sewing' : 'Ppe';
        if (kind !== type) return [];
        const prices = cards[index].flatMap((card) =>
          card.priceFrom === null ? [] : [card.priceFrom],
        );
        return [
          {
            slug: node.slug,
            name: node.name[locale],
            productCount: node.productCount,
            priceFrom: prices.length > 0 ? Math.min(...prices) : null,
            children: node.children.map((child) => ({
              slug: child.slug,
              name: child.name[locale],
            })),
          },
        ];
      }),
    }))
    .filter((group) => group.sections.length > 0);

  return (
    <div className="grid gap-10 pb-4 sm:gap-12">
      <div className="grid gap-6">
        <PageHeader
          breadcrumbs={breadcrumbs}
          breadcrumbsLabel={dictionary.breadcrumbsLabel}
          title={dictionary.rootTitle}
          titleNote={total > 0 ? formatModelCount(locale, total) : undefined}
          lead={dictionary.rootLead}
        />
        <CatalogSearchBox
          indexUrl={catalogSearchIndexPath(locale)}
          action={path('search')}
          text={dictionary.search}
          className="max-w-[48rem]"
        />
      </div>
      {groups.length > 0 ? (
        <CatalogSectionGroups
          locale={locale}
          groups={groups}
          dictionary={dictionary}
          categoryHref={(slug) => localizedPath(locale, catalogCategoryPath(slug))}
        />
      ) : (
        <p className="max-w-[48rem] leading-relaxed text-muted-foreground">
          {dictionary.products.empty}
        </p>
      )}
      <CatalogOrder
        company={company}
        id="catalog-order"
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
