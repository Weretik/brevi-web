import { ARTICLES } from '@site/articles/model';
import { articlePath } from '@site/articles/seo';
import { getCatalogProductSlugs } from '@site/catalog/data-access';
import { flattenCatalogTree } from '@site/catalog/model';
import { SITE_PATHS, catalogCategoryPath, catalogProductPath } from '@site/core/i18n';
import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Pages in both languages with `hreflang` alternates. Each migrated page adds its own entry. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogProductSlugs();

  return buildSitemapEntries([
    { path: '/' },
    { path: SITE_PATHS.production },
    { path: SITE_PATHS.deliveryAndPayment },
    { path: SITE_PATHS.contacts },
    { path: SITE_PATHS.returnsExchanges },
    { path: SITE_PATHS.ourWork },
    { path: SITE_PATHS.certificates },
    { path: SITE_PATHS.articles },
    { path: SITE_PATHS.logoPrinting },
    { path: SITE_PATHS.wholesale },
    { path: SITE_PATHS.industries },
    { path: SITE_PATHS.regions },
    { path: SITE_PATHS.agreement },
    { path: SITE_PATHS.catalog },
    ...flattenCatalogTree().map((category) => ({ path: catalogCategoryPath(category.slug) })),
    ...products.map((slug) => ({ path: catalogProductPath(slug) })),
    ...ARTICLES.map((article) => ({ path: articlePath(article.slug) })),
  ]);
}
