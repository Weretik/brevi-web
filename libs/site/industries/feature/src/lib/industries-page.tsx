import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd, buildFaqPageJsonLd } from '@site/core/seo';
import {
  IndustriesFaq,
  IndustriesHero,
  IndustriesList,
  IndustriesOrder,
  IndustriesSteps,
  getIndustriesDictionary,
} from '@site/industries/ui';
import { PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Галузі» page in the order of the live `brevi.com.ua` page «Спецодяг для підприємств»: lead with the terms,
 * industries, how to get a quote, frequent questions, and the call to order. Static: the text is in the dictionary.
 */
export function IndustriesPage({ locale }: { locale: Locale }) {
  const dictionary = getIndustriesDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('industries') },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <IndustriesHero
        dictionary={dictionary}
        breadcrumbs={breadcrumbs}
        requestHref={path('request')}
        catalogHref={path('catalog')}
      />

      <PageSection
        id="industries-list"
        title={dictionary.list.title}
        label={{ index: '02', text: dictionary.list.label }}
      >
        <IndustriesList
          dictionary={dictionary.list}
          worksHref={path('ourWork')}
          logoHref={path('logoPrinting')}
        />
      </PageSection>

      <PageSection
        id="industries-steps"
        title={dictionary.steps.title}
        label={{ index: '03', text: dictionary.steps.label }}
      >
        <IndustriesSteps dictionary={dictionary.steps} />
      </PageSection>

      <PageSection
        id="industries-faq"
        title={dictionary.faq.title}
        label={{ index: '04', text: dictionary.faq.label }}
      >
        <IndustriesFaq items={dictionary.faq.items} />
      </PageSection>

      <IndustriesOrder
        id="industries-order"
        index="05"
        dictionary={dictionary.order}
        requestLabel={dictionary.request}
        requestHref={path('request')}
        wholesaleHref={path('wholesale')}
        contactsHref={path('contacts')}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
      <JsonLd
        data={buildFaqPageJsonLd(
          dictionary.faq.items.map((item) => ({ question: item.title, answer: item.text })),
        )}
      />
    </div>
  );
}
