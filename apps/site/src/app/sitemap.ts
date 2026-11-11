import { getArticleAddresses } from '@site/articles/data-access';
import { articlePath } from '@site/articles/seo';
import { getCatalogCategoryAddresses, getCatalogProductAddresses } from '@site/catalog/data-access';
import { SITE_PATHS, catalogCategoryPath, catalogProductPath } from '@site/core/i18n';
import { buildSitemapEntries } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/**
 * Pages in both languages with `hreflang` alternates. Each migrated page adds its own entry. Catalog pages
 * and articles come from the Admin; a page without Russian texts is listed only in Ukrainian.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, articles] = await Promise.all([
    getCatalogCategoryAddresses(),
    getCatalogProductAddresses(),
    getArticleAddresses(),
  ]);

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
    ...categories.map((category) => ({
      path: catalogCategoryPath(category.slug),
      lastModified: new Date(category.updatedAt),
      locales: category.hasRussian ? undefined : (['uk'] as const),
    })),
    ...products.map((product) => ({
      path: catalogProductPath(product.slug),
      lastModified: new Date(product.updatedAt),
      locales: product.hasRussian ? undefined : (['uk'] as const),
    })),
    ...articles.map((article) => ({
      path: articlePath(article.slug),
      lastModified: new Date(article.updatedAt),
      locales: article.hasRussian ? undefined : (['uk'] as const),
    })),
  ]);
}
