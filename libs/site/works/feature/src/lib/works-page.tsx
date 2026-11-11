import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { galleryText, loadSiteGalleries } from '@site/settings/data-access';
import { PageHeader, PageSection } from '@site/shared/ui';
import { STATIC_WORK_PICTURES, WorksGallery, WorksOrder, getWorksDictionary } from '@site/works/ui';

import type { Locale } from '@site/core/i18n';
import type { WorkPicture } from '@site/works/ui';

/** Size reserved for a library photo whose size is unknown; the photo keeps its own shape once loaded. */
const FALLBACK_SIZE = { width: 480, height: 360 };

/** Anchor of the home contacts block; «Обговорити пошиття» leads there until the request page exists. */
const REQUEST_ANCHOR = '#zayavka';

/**
 * «Наші роботи» page: the photo gallery from «Контент → Наші роботи» and a closing block with the next step.
 * Without the Admin list the page shows its own files in `apps/site/public/assets/works`.
 */
export async function WorksPage({ locale }: { locale: Locale }) {
  const dictionary = getWorksDictionary(locale);
  const { works } = await loadSiteGalleries();
  const photos: readonly WorkPicture[] =
    works.length > 0
      ? works.map((photo) => ({
          key: photo.url,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl,
          width: photo.width ?? FALLBACK_SIZE.width,
          height: photo.height ?? FALLBACK_SIZE.height,
          alt: galleryText(photo.title, locale) || null,
        }))
      : STATIC_WORK_PICTURES;
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
        <WorksGallery photos={photos} dictionary={dictionary.gallery} />
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
