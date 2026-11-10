import {
  AgreementContents,
  AgreementRequisites,
  AgreementSection,
  getAgreementDictionary,
  getAgreementText,
} from '@site/agreement/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';
import Link from 'next/link';

import type { Locale } from '@site/core/i18n';

/**
 * «Договір» page: the public offer of the live `brevi.com.ua` clause by clause, with a table of contents and
 * the seller details. Static: the offer is in the data files of `site-agreement-ui`.
 */
export function AgreementPage({ locale }: { locale: Locale }) {
  const dictionary = getAgreementDictionary(locale);
  const text = getAgreementText(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('agreement') },
  ];
  const related = [
    { href: path('deliveryAndPayment'), label: dictionary.related.delivery },
    { href: path('returnsExchanges'), label: dictionary.related.returns },
    { href: path('contacts'), label: dictionary.related.contacts },
  ];

  return (
    <div className="grid gap-10 pb-4 sm:gap-12">
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={dictionary.breadcrumbsLabel}
        label={dictionary.label}
        title={dictionary.title}
      />

      <div className="grid max-w-[56rem] gap-8">
        <p className="leading-relaxed">{text.intro}</p>
        <AgreementContents label={dictionary.contentsTitle} sections={text.sections} />
        {text.sections.map((section) => (
          <AgreementSection key={section.number} section={section} />
        ))}
      </div>

      <PageSection
        id="agreement-requisites"
        title={dictionary.requisites.title}
        label={{ index: '12', text: dictionary.requisites.label }}
      >
        <div className="grid gap-6">
          <AgreementRequisites dictionary={dictionary.requisites} locale={locale} />
          <p className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
            {related.map((link) => (
              <Link key={link.href} href={link.href} className="text-brand-text hover:underline">
                {link.label} <span aria-hidden>→</span>
              </Link>
            ))}
          </p>
        </div>
      </PageSection>

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}
