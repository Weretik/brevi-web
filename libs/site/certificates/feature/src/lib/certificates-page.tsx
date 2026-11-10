import {
  CERTIFICATE_DOCUMENTS,
  CertificatesCopies,
  CertificatesDocuments,
  getCertificatesDictionary,
} from '@site/certificates/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Сертифікати» page: the documents of the live `brevi.com.ua` page with their scans, and a note that
 * certified copies come with the shipment. Static: the scans are files in
 * `apps/site/public/assets/certificates`.
 */
export function CertificatesPage({ locale }: { locale: Locale }) {
  const dictionary = getCertificatesDictionary(locale);
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
        <CertificatesDocuments
          documents={CERTIFICATE_DOCUMENTS}
          dictionary={dictionary.documents}
        />
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
