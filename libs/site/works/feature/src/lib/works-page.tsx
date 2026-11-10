import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';
import { WORK_PHOTOS, WorksGallery, WorksOrder, getWorksDictionary } from '@site/works/ui';

import type { Locale } from '@site/core/i18n';

/** Anchor of the home contacts block; «Обговорити пошиття» leads there until the request page exists. */
const REQUEST_ANCHOR = '#zayavka';

/**
 * «Наші роботи» page: the photo gallery of the live `brevi.com.ua` page and a closing block with the next
 * step. Static: the photos are files in `apps/site/public/assets/works`.
 */
export function WorksPage({ locale }: { locale: Locale }) {
  const dictionary = getWorksDictionary(locale);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.ourWork) },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={dictionary.breadcrumbsLabel}
        label={dictionary.label}
        title={dictionary.title}
        lead={dictionary.lead}
      />

      <PageSection
        id="works-gallery"
        title={dictionary.gallery.title}
        label={{ index: '02', text: dictionary.gallery.label }}
      >
        <WorksGallery photos={WORK_PHOTOS} dictionary={dictionary.gallery} />
      </PageSection>

      <WorksOrder
        id="works-order"
        dictionary={dictionary.order}
        discussHref={`${localizedPath(locale)}${REQUEST_ANCHOR}`}
        productionHref={localizedPath(locale, SITE_PATHS.production)}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
