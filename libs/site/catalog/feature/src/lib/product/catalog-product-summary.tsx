import { CatalogProductBuy, CatalogProductGallery, getCatalogDictionary } from '@site/catalog/ui';
import { SizeChartSheet, getSizesDictionary } from '@site/sizes/ui';

import { CatalogProductHeading } from './catalog-product-heading';

import type { CatalogProduct, CatalogProductFacts } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ComponentProps } from 'react';

/** Anchor of the order card; the price bar on phones hides while it is on the screen. */
export const CATALOG_PRODUCT_ORDER_ID = 'product-order';

/** Top of the product page: the photos beside the name and the order card with the price. */
export function CatalogProductSummary({
  product,
  facts,
  company,
  locale,
  noPhoto,
  requestHref,
  sizeChartHref,
}: {
  product: CatalogProduct;
  facts: CatalogProductFacts;
  company: ComponentProps<typeof CatalogProductBuy>['company'];
  locale: Locale;
  noPhoto: string;
  requestHref: string;
  sizeChartHref: string;
}) {
  const text = getCatalogDictionary(locale).product;
  return (
    <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
      <div className="lg:sticky lg:top-20">
        <CatalogProductGallery
          photos={product.photos}
          name={product.name}
          labels={{
            gallery: text.gallery,
            photo: text.photo,
            noPhoto: noPhoto,
          }}
        />
      </div>
      <div className="grid gap-5">
        <CatalogProductHeading
          facts={facts}
          model={product.model}
          name={product.name}
          modelLabel={text.model}
        />
        <CatalogProductBuy
          id={CATALOG_PRODUCT_ORDER_ID}
          company={company}
          fabrics={product.fabrics}
          prices={product.prices}
          dictionary={text}
          requestHref={requestHref}
        >
          <SizeChartSheet dictionary={getSizesDictionary(locale)} fullPageHref={sizeChartHref} />
        </CatalogProductBuy>
      </div>
    </div>
  );
}
