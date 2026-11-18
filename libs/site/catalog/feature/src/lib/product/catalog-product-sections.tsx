import {
  CatalogExpandableText,
  CatalogProductGrid,
  CatalogProductSpecs,
  CatalogText,
} from '@site/catalog/ui';
import { PageSection } from '@site/shared/ui';

import type { CatalogProduct, CatalogProductCard } from '@site/catalog/model';
import type { CatalogDictionary } from '@site/catalog/ui';

/** Lower blocks of the product page: characteristics, the folded description and other models of the category. */
export function CatalogProductSections({
  specs,
  description,
  related,
  allHref,
  dictionary,
  requestHref,
  productHref,
}: {
  specs: CatalogProduct['specs'];
  description: CatalogProduct['description'];
  related: readonly CatalogProductCard[];
  allHref: string | null;
  dictionary: CatalogDictionary;
  requestHref: string;
  productHref: (slug: string) => string;
}) {
  const text = dictionary.product;
  return (
    <>
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
          action={allHref ? { href: allHref, label: text.related.all } : undefined}
        >
          <CatalogProductGrid
            products={related}
            dictionary={dictionary.products}
            requestHref={requestHref}
            productHref={productHref}
          />
        </PageSection>
      ) : null}
    </>
  );
}
