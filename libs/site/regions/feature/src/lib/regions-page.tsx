import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import {
  RegionsCities,
  RegionsHero,
  RegionsLocal,
  RegionsOrder,
  RegionsSteps,
  getRegionsDictionary,
} from '@site/regions/ui';
import { PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Регіони» page: one page about orders from any city of Ukraine. Lead with the delivery terms, how to order
 * from another city, the cities, what a buyer in Poltava gets, and the call to order. Static.
 */
export function RegionsPage({ locale }: { locale: Locale }) {
  const dictionary = getRegionsDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('regions') },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <RegionsHero
        dictionary={dictionary}
        breadcrumbs={breadcrumbs}
        requestHref={path('request')}
        deliveryHref={path('deliveryAndPayment')}
      />

      <PageSection
        id="regions-steps"
        title={dictionary.steps.title}
        label={{ index: '02', text: dictionary.steps.label }}
      >
        <RegionsSteps dictionary={dictionary.steps} />
      </PageSection>

      <PageSection
        id="regions-cities"
        title={dictionary.cities.title}
        label={{ index: '03', text: dictionary.cities.label }}
      >
        <RegionsCities dictionary={dictionary.cities} />
      </PageSection>

      <PageSection
        id="regions-local"
        title={dictionary.local.title}
        label={{ index: '04', text: dictionary.local.label }}
      >
        <RegionsLocal
          dictionary={dictionary.local}
          locale={locale}
          contactsHref={path('contacts')}
          productionHref={path('production')}
        />
      </PageSection>

      <RegionsOrder
        id="regions-order"
        index="05"
        dictionary={dictionary.order}
        requestLabel={dictionary.request}
        requestHref={path('request')}
        wholesaleHref={path('wholesale')}
        industriesHref={path('industries')}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
