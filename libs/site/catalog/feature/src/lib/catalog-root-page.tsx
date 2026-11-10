import { CATALOG_TREE } from '@site/catalog/model';
import {
  CatalogOrder,
  CatalogSectionsGrid,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import { SITE_PATHS, catalogCategoryPath, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/** Catalog root: every section with its subsections and the call to order. Static. */
export function CatalogRootPage({ locale }: { locale: Locale }) {
  const dictionary = getCatalogDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
  ];
  const total = CATALOG_TREE.reduce((sum, section) => sum + section.productCount, 0);

  return (
    <div className="grid gap-10 pb-4 sm:gap-14">
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={dictionary.breadcrumbsLabel}
        label={`${dictionary.label} · ${formatModelCount(locale, total)}`}
        title={dictionary.rootTitle}
        lead={dictionary.rootLead}
      />
      <CatalogSectionsGrid
        locale={locale}
        sections={CATALOG_TREE}
        label={dictionary.sectionsLabel}
        categoryHref={(slug) => localizedPath(locale, catalogCategoryPath(slug))}
      />
      <CatalogOrder
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
