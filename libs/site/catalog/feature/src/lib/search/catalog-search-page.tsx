import { searchCatalogProducts, searchCatalogSections } from '@site/catalog/model';
import {
  CatalogOrder,
  CatalogProductGrid,
  CatalogSearchBox,
  formatModelCount,
  getCatalogDictionary,
} from '@site/catalog/ui';
import { SITE_PATHS, catalogSearchIndexPath, localizedPath } from '@site/core/i18n';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageHeader } from '@site/shared/ui';
import Link from 'next/link';

import { buildCatalogSearchIndex } from './catalog-search-index';

import type { Locale } from '@site/core/i18n';

/** Longest query the page reads; a longer one is cut, it cannot match a product name anyway. */
const MAX_QUERY = 100;

/**
 * Search results: the search box with the query, the matching categories as links, and the matching
 * models as a listing. The page is not indexed (see `buildCatalogSearchMetadata`); without a query it
 * shows only the box and the call to order.
 */
export async function CatalogSearchPage({ locale, query }: { locale: Locale; query: string }) {
  const company = await loadSiteCompany();
  const dictionary = getCatalogDictionary(locale);
  const text = dictionary.search;
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const trimmed = query.trim().slice(0, MAX_QUERY);
  const index = await buildCatalogSearchIndex(locale);
  const products = trimmed ? searchCatalogProducts(index.products, trimmed) : [];
  const sections = trimmed ? searchCatalogSections(index.sections, trimmed) : [];
  const hrefs = new Map(index.products.map((product) => [product.slug, product.href]));
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    { name: text.title, href: path('search') },
  ];

  return (
    <div className="grid gap-8 pb-4 sm:gap-12">
      <div className="grid gap-5">
        <PageHeader
          breadcrumbs={breadcrumbs}
          breadcrumbsLabel={dictionary.breadcrumbsLabel}
          title={text.title}
          lead={trimmed ? undefined : text.lead}
        />
        <CatalogSearchBox
          indexUrl={catalogSearchIndexPath(locale)}
          action={path('search')}
          text={text}
          defaultValue={trimmed}
          className="max-w-[48rem]"
        />
      </div>

      {trimmed ? (
        <section aria-label={text.products} className="grid gap-5">
          <p className="text-lg">
            {text.resultsFor} «<b>{trimmed}</b>»:{' '}
            <span className="text-muted-foreground">
              {formatModelCount(locale, products.length)}
            </span>
          </p>
          {sections.length > 0 ? (
            <nav aria-label={text.sections}>
              <ul className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <li key={section.slug}>
                    <Link
                      href={section.href}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-sm font-semibold hover:border-foreground"
                    >
                      {section.parent ? `${section.parent} · ${section.name}` : section.name}
                      <span className="font-mono text-xs text-muted-foreground">
                        {section.productCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {products.length > 0 ? (
            <CatalogProductGrid
              products={products}
              dictionary={dictionary.products}
              requestHref={path('request')}
              productHref={(slug) => hrefs.get(slug) ?? path('catalog')}
            />
          ) : (
            <p className="max-w-[48rem] leading-relaxed text-muted-foreground">{text.empty}</p>
          )}
        </section>
      ) : null}

      <CatalogOrder
        company={company}
        id="catalog-order"
        dictionary={dictionary.order}
        requestHref={path('request')}
        logoHref={path('logoPrinting')}
        wholesaleHref={path('wholesale')}
      />
    </div>
  );
}
