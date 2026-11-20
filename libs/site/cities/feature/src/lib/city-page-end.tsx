import { CityFaq, CityLinks, CityOrder } from '@site/cities/ui';
import { JsonLd, buildBreadcrumbJsonLd, buildFaqPageJsonLd } from '@site/core/seo';
import { DeliveryAcrossUkraine, getDeliveryDictionary } from '@site/delivery/ui';
import { PageSection } from '@site/shared/ui';

import type { CityPageData } from './city-page-data';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/**
 * The blocks both kinds of city page end with: the delivery map, the questions, links to nearby cities and the
 * pair page, the call to order, and the `BreadcrumbList` and `FAQPage` markup of what the page shows.
 */
export function CityPageEnd({
  locale,
  company,
  data,
  next,
}: {
  locale: Locale;
  company: Company;
  data: CityPageData;
  /** Gives the number of the next block. */
  next: () => string;
}) {
  const { dictionary, kindText, text, where } = data;
  return (
    <>
      <DeliveryAcrossUkraine
        id="city-delivery"
        index={next()}
        dictionary={getDeliveryDictionary(locale).acrossUkraine}
        moreHref={data.path('deliveryAndPayment')}
      />

      <PageSection
        id="city-faq"
        title={kindText.faq(where)}
        label={{ index: next(), text: dictionary.faqLabel }}
      >
        <CityFaq items={text.faq} />
      </PageSection>

      <PageSection
        id="city-links"
        title={dictionary.links.title}
        label={{ index: next(), text: dictionary.links.label }}
      >
        <CityLinks {...data.links} />
      </PageSection>

      <CityOrder
        company={company}
        id="city-order"
        index={next()}
        title={kindText.order(where)}
        dictionary={dictionary}
        requestHref={data.requestHref}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          data.breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
      <JsonLd data={buildFaqPageJsonLd(text.faq)} />
    </>
  );
}
