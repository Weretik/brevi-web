import { getCatalogProductCategory, getCatalogRelatedProducts } from '@site/catalog/data-access';
import { splitCatalogProductFacts } from '@site/catalog/model';
import {
  CatalogOrder,
  CatalogProductNav,
  CatalogProductPriceBar,
  formatPrice,
  getCatalogDictionary,
} from '@site/catalog/ui';
import {
  SITE_PATHS,
  catalogCategoryPath,
  catalogProductPath,
  localizedPath,
  requestHref,
} from '@site/core/i18n';
import { loadSiteCompany } from '@site/settings/data-access';
import { Breadcrumbs } from '@site/shared/ui';

import { productNav, productSpecs } from './catalog-product-blocks';
import { CatalogProductJsonLd } from './catalog-product-json-ld';
import { CatalogProductSections } from './catalog-product-sections';
import { CATALOG_PRODUCT_ORDER_ID, CatalogProductSummary } from './catalog-product-summary';

import type { CatalogProduct } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** How many neighbours of the same category the page links to. */
const RELATED_LIMIT = 4;

/**
 * Product page (concept «Ціна поруч»): photos, the tags and the name with one line on who the model is for,
 * then the order card with the price right under the name. Below are links to the blocks, the
 * characteristics with the short facts first, the folded description, other models of the same category,
 * and the call to order. Phones get a price strip at the bottom of the screen. No cart. `product` is already in
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
  const name = product.name;
  // «Купити» opens the request window with this product in the form.
  const buyHref = requestHref(locale, name);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.catalog, href: path('catalog') },
    ...(category?.trail ?? []).map((node) => ({
      name: node.name[locale],
      href: categoryHref(node.slug),
    })),
    { name, href: productHref(product.slug) },
  ];
  const { description } = product;
  const facts = splitCatalogProductFacts(product.summary);
  const specs = productSpecs(product, facts, dictionary.product.specs.summary);
  const text = dictionary.product;
  const nav = productNav(text, {
    specs: specs.length > 0,
    description: description.length > 0,
    related: related.length > 0,
    sizesHref: path('sizeChart'),
  });

  return (
    <div className="grid gap-10 pb-4 sm:gap-14">
      <div className="grid gap-6 pt-6 sm:gap-8 sm:pt-8">
        <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
        <CatalogProductSummary
          product={product}
          facts={facts}
          company={company}
          locale={locale}
          noPhoto={dictionary.products.noPhoto}
          requestHref={buyHref}
          sizeChartHref={path('sizeChart')}
        />
        <CatalogProductNav label={text.nav.label} items={nav} />
      </div>

      <CatalogProductSections
        specs={specs}
        description={description}
        related={related}
        allHref={category ? categoryHref(category.node.slug) : null}
        dictionary={dictionary}
        requestHref={path('request')}
        productHref={productHref}
      />

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
          targetId={CATALOG_PRODUCT_ORDER_ID}
          price={`${text.priceFrom} ${formatPrice(product.priceFrom)} ${text.currencyShort}`}
          label={text.priceBar.label}
          request={text.priceBar.request}
          requestHref={buyHref}
        />
      ) : null}

      <CatalogProductJsonLd
        locale={locale}
        product={product}
        categoryName={category?.node.name[locale] ?? null}
        breadcrumbs={breadcrumbs}
      />
    </div>
  );
}
