import { getCatalogProductCategory, getCatalogRelatedProducts } from '@site/catalog/data-access';
import { buildCatalogProductJsonLd } from '@site/catalog/seo';
import {
  CatalogOrder,
  CatalogProductBuy,
  CatalogProductGallery,
  CatalogProductGrid,
  CatalogProductSpecs,
  CatalogText,
  getCatalogDictionary,
} from '@site/catalog/ui';
import {
  SITE_PATHS,
  catalogCategoryPath,
  catalogProductPath,
  localizedPath,
} from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { loadSiteCompany } from '@site/settings/data-access';
import { Breadcrumbs, PageSection, StitchLabel } from '@site/shared/ui';
import { SizeChartSheet, getSizesDictionary } from '@site/sizes/ui';

import type { CatalogProduct } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** How many neighbours of the same category the page links to. */
const RELATED_LIMIT = 4;

/**
 * Product page: photos, the name and short facts with the prices by order size and the way to order, the
 * description, the characteristics, other models of the same category, and the call to order. No cart.
 * `product` is already in the language of the page.
 */
export async function CatalogProductPage({
  locale,
  product,
}: {
  locale: Locale;
  product: CatalogProduct;
}) {
  const company = await loadSiteCompany();
  const dictionary = getCatalogDictionary(locale);
  const [related, category] = await Promise.all([
    getCatalogRelatedProducts(product, locale, RELATED_LIMIT),
    getCatalogProductCategory(product),
  ]);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const categoryHref = (slug: string) => localizedPath(locale, catalogCategoryPath(slug));
  const productHref = (slug: string) => localizedPath(locale, catalogProductPath(slug));
  const trail = category?.trail ?? [];
  const name = product.name;
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    ...trail.map((node) => ({ name: node.name[locale], href: categoryHref(node.slug) })),
    { name, href: productHref(product.slug) },
  ];
  const { description, specs } = product;
  const sections = [
    description.length > 0 ? 'description' : null,
    specs.length > 0 ? 'specs' : null,
    related.length > 0 ? 'related' : null,
    'order',
  ].filter((key) => key !== null);
  const index = (key: string) => String(sections.indexOf(key) + 2).padStart(2, '0');

  return (
    <div className="grid gap-10 pb-4 sm:gap-14">
      <div className="grid gap-6 pt-6 sm:gap-8 sm:pt-8">
        <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
          <CatalogProductGallery
            photos={product.photos}
            name={name}
            labels={{
              gallery: dictionary.product.gallery,
              photo: dictionary.product.photo,
              noPhoto: dictionary.products.noPhoto,
            }}
          />
          <div className="grid gap-5">
            <StitchLabel index="01">
              {category?.node.name[locale] ?? dictionary.product.label}
            </StitchLabel>
            <h1 className="text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.25rem]">
              {name}
            </h1>
            <CatalogProductBuy
              company={company}
              model={product.model}
              summary={product.summary}
              fabrics={product.fabrics}
              prices={product.prices}
              dictionary={dictionary.product}
              requestHref={path('request')}
            />
            <SizeChartSheet
              dictionary={getSizesDictionary(locale)}
              fullPageHref={path('sizeChart')}
            />
          </div>
        </div>
      </div>

      {description.length > 0 ? (
        <PageSection
          id="product-description"
          title={dictionary.product.description.title}
          label={{ index: index('description'), text: dictionary.product.description.label }}
        >
          <CatalogText blocks={description} />
        </PageSection>
      ) : null}

      {specs.length > 0 ? (
        <PageSection
          id="product-specs"
          title={dictionary.product.specs.title}
          label={{ index: index('specs'), text: dictionary.product.specs.label }}
        >
          <CatalogProductSpecs groups={specs} />
        </PageSection>
      ) : null}

      {related.length > 0 ? (
        <PageSection
          id="product-related"
          title={dictionary.product.related.title}
          label={{ index: index('related'), text: dictionary.product.related.label }}
          action={
            category
              ? { href: categoryHref(category.node.slug), label: dictionary.product.related.all }
              : undefined
          }
        >
          <CatalogProductGrid
            products={related}
            dictionary={dictionary.products}
            requestHref={path('request')}
            productHref={productHref}
          />
        </PageSection>
      ) : null}

      <CatalogOrder
        company={company}
        id="catalog-order"
        index={index('order')}
        dictionary={dictionary.order}
        requestHref={path('request')}
        logoHref={path('logoPrinting')}
        wholesaleHref={path('wholesale')}
      />

      <JsonLd
        data={buildCatalogProductJsonLd(locale, product, category?.node.name[locale] ?? null)}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
