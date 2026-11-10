import {
  ContactsInfo,
  ContactsManagers,
  ContactsMap,
  getContactsDictionary,
} from '@site/contacts/ui';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd, buildLocalBusinessJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Контакти» page in the order of the live `brevi.com.ua` page: company contacts with the map and hours, then
 * the client managers. Static: the facts are in `COMPANY`, the captions in the contacts dictionary.
 */
export function ContactsPage({ locale }: { locale: Locale }) {
  const dictionary = getContactsDictionary(locale);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.contacts) },
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
        id="contacts-info"
        title={dictionary.info.title}
        label={{ index: '02', text: dictionary.info.label }}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ContactsInfo locale={locale} dictionary={dictionary.info} />
          <ContactsMap locale={locale} dictionary={dictionary.info} />
        </div>
      </PageSection>

      <PageSection
        id="contacts-managers"
        title={dictionary.managers.title}
        label={{ index: '03', text: dictionary.managers.label }}
      >
        <ContactsManagers locale={locale} dictionary={dictionary.managers} />
      </PageSection>

      <JsonLd
        data={[
          buildBreadcrumbJsonLd(breadcrumbs.map((item) => ({ name: item.name, path: item.href }))),
          buildLocalBusinessJsonLd(locale),
        ]}
      />
    </div>
  );
}
