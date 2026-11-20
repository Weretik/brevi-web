import { CityHero, CityPoints } from '@site/cities/ui';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageSection } from '@site/shared/ui';

import { blockNumbers, cityPageData } from './city-page-data';
import { CityPageEnd } from './city-page-end';
import { CityProductsSection } from './city-products-section';

import type { CatalogProductCard } from '@site/catalog/model';
import type { City } from '@site/cities/model';
import type { Locale } from '@site/core/i18n';

/**
 * «Робочий одяг» page of a city: buying ready workwear and protective equipment from the catalog. The intro, the
 * needs and the questions are written for the city; the models, the prices by quantity, the map and the call to
 * order are shared. The models come from the route; the block is left out while there are none.
 */
export async function WorkwearCityPage({
  locale,
  city,
  products,
}: {
  locale: Locale;
  city: City;
  products: readonly CatalogProductCard[];
}) {
  const company = await loadSiteCompany();
  const data = cityPageData('workwear', city, locale);
  const { dictionary, text, kindText, where } = data;
  const next = blockNumbers();

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <CityHero
        company={company}
        dictionary={dictionary}
        label={kindText.label}
        title={data.title}
        intro={text.intro}
        facts={data.facts}
        breadcrumbs={data.breadcrumbs}
        requestHref={data.requestHref}
      />

      <PageSection
        id="city-needs"
        title={kindText.needs(where)}
        label={{ index: next(), text: dictionary.needsLabel }}
      >
        <CityPoints items={text.needs} />
      </PageSection>

      {products.length > 0 && (
        <CityProductsSection
          locale={locale}
          index={next()}
          title={kindText.products}
          label={dictionary.productsLabel}
          all={{ href: data.path('catalog'), label: dictionary.productsAll }}
          products={products}
          requestHref={data.requestHref}
        />
      )}

      <PageSection
        id="city-prices"
        title={dictionary.prices.title}
        label={{ index: next(), text: dictionary.prices.label }}
        action={{ href: data.path('wholesale'), label: dictionary.prices.more }}
      >
        <CityPoints items={dictionary.prices.items} />
      </PageSection>

      <CityPageEnd locale={locale} company={company} data={data} next={next} />
    </div>
  );
}
