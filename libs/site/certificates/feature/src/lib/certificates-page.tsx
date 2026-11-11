import {
  CertificatesCopies,
  CertificatesDocuments,
  getCertificatesDictionary,
  staticCertificateCards,
} from '@site/certificates/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { galleryText, loadSiteGalleries } from '@site/settings/data-access';
import { PageHeader, PageSection } from '@site/shared/ui';

import type { CertificateCard } from '@site/certificates/ui';
import type { Locale } from '@site/core/i18n';

/** Size reserved for a scan whose size is unknown: the scans are A4 pages. */
const FALLBACK_SIZE = { width: 425, height: 600 };

/**
 * «Сертифікати» page: the documents from «Контент → Сертифікати» with their scans, and a note that certified
 * copies come with the shipment. Without the Admin list the page shows its own scans in
 * `apps/site/public/assets/certificates`.
 */
export async function CertificatesPage({ locale }: { locale: Locale }) {
  const dictionary = getCertificatesDictionary(locale);
  const { certificates } = await loadSiteGalleries();
  const documents: readonly CertificateCard[] =
    certificates.length > 0
      ? certificates.map((document) => ({
          key: document.url,
          url: document.url,
          thumbnailUrl: document.thumbnailUrl,
          width: document.width ?? FALLBACK_SIZE.width,
          height: document.height ?? FALLBACK_SIZE.height,
          title: galleryText(document.title, locale),
          scope: galleryText(document.note, locale),
          standards: document.standards,
        }))
      : staticCertificateCards(dictionary.documents);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.certificates) },
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
        id="certificates-documents"
        title={dictionary.documents.title}
        label={{ index: '02', text: dictionary.documents.label }}
      >
        <CertificatesDocuments documents={documents} dictionary={dictionary.documents} />
      </PageSection>

      <CertificatesCopies
        id="certificates-copies"
        dictionary={dictionary.copies}
        contactsHref={localizedPath(locale, SITE_PATHS.contacts)}
      />

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
