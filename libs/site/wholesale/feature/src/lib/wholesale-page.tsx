import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageSection } from '@site/shared/ui';
import {
  WholesaleHero,
  WholesaleOrder,
  WholesaleRange,
  WholesaleReasons,
  WholesaleTiers,
  getWholesaleDictionary,
} from '@site/wholesale/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Ціни для опту» page: lead with the wholesale terms, the three price levels, what can be ordered,
 * why Brevi, and how to order. Static: the text is in the dictionary and the page shows no prices.
 */
export function WholesalePage({ locale }: { locale: Locale }) {
  const dictionary = getWholesaleDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('wholesale') },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <WholesaleHero
        dictionary={dictionary}
        breadcrumbs={breadcrumbs}
        requestHref={path('request')}
        catalogHref={path('catalog')}
      />

      <PageSection
        id="wholesale-tiers"
        title={dictionary.tiers.title}
        label={{ index: '02', text: dictionary.tiers.label }}
      >
        <WholesaleTiers dictionary={dictionary.tiers} />
      </PageSection>

      <PageSection
        id="wholesale-range"
        title={dictionary.range.title}
        label={{ index: '03', text: dictionary.range.label }}
      >
        <WholesaleRange
          dictionary={dictionary.range}
          catalogHref={path('catalog')}
          logoHref={path('logoPrinting')}
        />
      </PageSection>

      <PageSection
        id="wholesale-reasons"
        title={dictionary.reasons.title}
        label={{ index: '04', text: dictionary.reasons.label }}
      >
        <WholesaleReasons
          dictionary={dictionary.reasons}
          productionHref={path('production')}
          certificatesHref={path('certificates')}
        />
      </PageSection>

      <WholesaleOrder
        id="wholesale-order"
        index="05"
        dictionary={dictionary.order}
        requestLabel={dictionary.request}
        requestHref={path('request')}
        contactsHref={path('contacts')}
        deliveryHref={path('deliveryAndPayment')}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
