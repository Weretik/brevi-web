import { getCatalogProductAddresses, getCatalogTree } from '@site/catalog/data-access';
import {
  CatalogOrder,
  CatalogSectionsGrid,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import { SITE_PATHS, catalogCategoryPath, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageHeader } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * Catalog root: the categories with their subcategories from the Admin, and the call to order. While the
 * catalog is empty or unavailable the page keeps its heading and the call to order.
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

  return (
    <div className="grid gap-10 pb-4 sm:gap-14">
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={dictionary.breadcrumbsLabel}
        label={
          total > 0 ? `${dictionary.label} · ${formatModelCount(locale, total)}` : dictionary.label
        }
        title={dictionary.rootTitle}
        lead={dictionary.rootLead}
      />
      {tree.length > 0 ? (
        <CatalogSectionsGrid
          locale={locale}
          sections={tree}
          label={dictionary.sectionsLabel}
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
        index="02"
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
