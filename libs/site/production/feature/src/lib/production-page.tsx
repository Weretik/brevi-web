import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import {
  ProductionDetails,
  ProductionHero,
  ProductionOrder,
  ProductionProse,
  ProductionStages,
  getProductionDictionary,
} from '@site/production/ui';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/** Anchor of the home contacts block; «Обговорити пошиття» leads there until the request page exists. */
const REQUEST_ANCHOR = '#zayavka';

/**
 * «Виробництво» page in the order of the live `brevi.com.ua` page: lead, production stages, fabric, threads
 * and hardware, branding, and how to start an order. Static: the text is in the production dictionary.
 */
export async function ProductionPage({ locale }: { locale: Locale }) {
  const company = await loadSiteCompany();
  const dictionary = getProductionDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const discussHref = `${localizedPath(locale)}${REQUEST_ANCHOR}`;
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('production') },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <ProductionHero
        dictionary={dictionary}
        breadcrumbs={breadcrumbs}
        discussHref={discussHref}
        worksHref={path('ourWork')}
      />

      <PageSection
        id="production-stages"
        title={dictionary.stages.title}
        label={{ index: '02', text: dictionary.stages.label }}
      >
        <ProductionStages dictionary={dictionary.stages} />
      </PageSection>

      <PageSection
        id="production-fabric"
        title={dictionary.fabric.title}
        label={{ index: '03', text: dictionary.fabric.label }}
      >
        <ProductionProse paragraphs={dictionary.fabric.paragraphs} />
      </PageSection>

      <PageSection
        id="production-details"
        title={dictionary.details.title}
        label={{ index: '04', text: dictionary.details.label }}
      >
        <ProductionDetails dictionary={dictionary.details} />
      </PageSection>

      <PageSection
        id="production-branding"
        title={dictionary.branding.title}
        label={{ index: '05', text: dictionary.branding.label }}
        action={{ href: path('logoPrinting'), label: dictionary.branding.more }}
      >
        <ProductionProse paragraphs={dictionary.branding.paragraphs} />
      </PageSection>

      <ProductionOrder
        company={company}
        id="production-order"
        dictionary={dictionary.order}
        discussHref={discussHref}
        contactsHref={path('contacts')}
        worksHref={path('ourWork')}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
