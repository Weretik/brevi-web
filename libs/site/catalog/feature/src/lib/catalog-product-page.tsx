import { getCatalogProductCategory, getCatalogRelatedProducts } from '@site/catalog/data-access';
import { splitCatalogProductFacts } from '@site/catalog/model';
import { buildCatalogProductJsonLd } from '@site/catalog/seo';
import {
  CatalogExpandableText,
  CatalogOrder,
  CatalogProductBuy,
  CatalogProductGallery,
  CatalogProductGrid,
  CatalogProductNav,
  CatalogProductPriceBar,
  CatalogProductSpecs,
  CatalogText,
  formatPrice,
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
import { Breadcrumbs, PageSection } from '@site/shared/ui';
import { SizeChartSheet, getSizesDictionary } from '@site/sizes/ui';

import type { CatalogProduct } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** How many neighbours of the same category the page links to. */
const RELATED_LIMIT = 4;
/** Anchor of the order card; the price bar on phones hides while it is on the screen. */
const ORDER_CARD_ID = 'product-order';

/**
 * Product page (concept «Ціна поруч»): photos, the tags and the name with one line on who the model is for,
 * then the order card with the price right under the name. Below are links to the blocks, the
 * characteristics with the short facts first, the folded description, other models of the same category,
 * and the call to order. Phones get a price strip above the bottom bar. No cart. `product` is already in
 * the language of the page.
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
  const { description } = product;
  const facts = splitCatalogProductFacts(product.summary);
  const specs = [
    ...(facts.rows.length > 0
      ? [{ title: dictionary.product.specs.summary, rows: facts.rows }]
      : []),
    ...product.specs,
  ];
  const text = dictionary.product;
  const nav = [
    specs.length > 0 ? { href: '#product-specs', label: text.specs.title } : null,
    description.length > 0 ? { href: '#product-description', label: text.description.label } : null,
    related.length > 0 ? { href: '#product-related', label: text.related.label } : null,
    { href: path('sizeChart'), label: text.nav.sizes },
  ].filter((item) => item !== null);

  return (
    <div className="grid gap-10 pb-4 sm:gap-14">
      <div className="grid gap-6 pt-6 sm:gap-8 sm:pt-8">
        <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
          <div className="lg:sticky lg:top-20">
            <CatalogProductGallery
              photos={product.photos}
              name={name}
              labels={{
                gallery: text.gallery,
                photo: text.photo,
                noPhoto: dictionary.products.noPhoto,
              }}
            />
          </div>
          <div className="grid gap-5">
            {facts.tags.length > 0 || product.model ? (
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {facts.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border-strong px-3 py-0.5 font-semibold text-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {product.model ? (
                  <span>
                    {text.model}{' '}
                    <span className="font-mono font-semibold text-foreground">{product.model}</span>
                  </span>
                ) : null}
              </div>
            ) : null}
            <h1 className="text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.25rem]">
              {name}
            </h1>
            {facts.audience || facts.notes.length > 0 ? (
              <div className="grid gap-1.5 leading-relaxed text-muted-foreground">
                {facts.audience ? (
                  <p className="line-clamp-3">
                    <strong className="text-foreground">{facts.audience.name}:</strong>{' '}
                    {facts.audience.value}
                  </p>
                ) : null}
                {facts.notes.map((note) => (
                  <p key={note} className="text-sm">
                    {note}
                  </p>
                ))}
              </div>
            ) : null}
            <CatalogProductBuy
              id={ORDER_CARD_ID}
              company={company}
              fabrics={product.fabrics}
              prices={product.prices}
              dictionary={text}
              requestHref={path('request')}
            >
              <SizeChartSheet
                dictionary={getSizesDictionary(locale)}
                fullPageHref={path('sizeChart')}
              />
            </CatalogProductBuy>
          </div>
        </div>
        <CatalogProductNav label={text.nav.label} items={nav} />
      </div>

      {specs.length > 0 ? (
        <PageSection id="product-specs" title={text.specs.title}>
          <CatalogProductSpecs groups={specs} className="max-w-none gap-x-14 lg:grid-cols-2" />
        </PageSection>
      ) : null}

      {description.length > 0 ? (
        <PageSection id="product-description" title={text.description.title}>
          <CatalogExpandableText more={text.description.more} less={text.description.less}>
            <CatalogText blocks={description} />
          </CatalogExpandableText>
        </PageSection>
      ) : null}

      {related.length > 0 ? (
        <PageSection
          id="product-related"
          title={text.related.title}
          action={
            category
              ? { href: categoryHref(category.node.slug), label: text.related.all }
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
        dictionary={dictionary.order}
        requestHref={path('request')}
        logoHref={path('logoPrinting')}
        wholesaleHref={path('wholesale')}
      />

      {product.priceFrom !== null ? (
        <CatalogProductPriceBar
          targetId={ORDER_CARD_ID}
          price={`${text.priceFrom} ${formatPrice(product.priceFrom)} ${text.currencyShort}`}
          label={text.priceBar.label}
          request={text.priceBar.request}
          requestHref={path('request')}
        />
      ) : null}

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
