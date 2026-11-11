import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { buildLogoPrintingServiceJsonLd } from '@site/logo-printing/seo';
import {
  LogoPrintingGarments,
  LogoPrintingHero,
  LogoPrintingMethods,
  LogoPrintingOrder,
  LogoPrintingSewing,
  getLogoPrintingDictionary,
} from '@site/logo-printing/ui';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Пошиття з логотипом» page in the order of the live `brevi.com.ua` page: lead with the order terms,
 * branding methods, kinds of workwear, custom sewing, and how to order. Static: the text is in the dictionary.
 */
export async function LogoPrintingPage({ locale }: { locale: Locale }) {
  const company = await loadSiteCompany();
  const dictionary = getLogoPrintingDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('logoPrinting') },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <LogoPrintingHero
        dictionary={dictionary}
        breadcrumbs={breadcrumbs}
        requestHref={path('request')}
        worksHref={path('ourWork')}
      />

      <PageSection
        id="logo-methods"
        title={dictionary.methods.title}
        label={{ index: '02', text: dictionary.methods.label }}
      >
        <LogoPrintingMethods dictionary={dictionary.methods} />
      </PageSection>

      <PageSection
        id="logo-garments"
        title={dictionary.garments.title}
        label={{ index: '03', text: dictionary.garments.label }}
      >
        <LogoPrintingGarments dictionary={dictionary.garments} />
      </PageSection>

      <PageSection
        id="logo-sewing"
        title={dictionary.sewing.title}
        label={{ index: '04', text: dictionary.sewing.label }}
      >
        <LogoPrintingSewing
          dictionary={dictionary.sewing}
          productionHref={path('production')}
          certificatesHref={path('certificates')}
        />
      </PageSection>

      <LogoPrintingOrder
        company={company}
        id="logo-order"
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
      <JsonLd data={buildLogoPrintingServiceJsonLd(locale)} />
    </div>
  );
}
