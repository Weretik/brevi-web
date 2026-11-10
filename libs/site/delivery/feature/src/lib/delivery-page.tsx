import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import {
  DeliveryContact,
  DeliveryHero,
  DeliveryOptions,
  DeliveryPayment,
  getDeliveryDictionary,
} from '@site/delivery/ui';
import { PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Доставка та оплата» page in the order of the live `brevi.com.ua` page: delivery, payment with the bank
 * details, and whom to call. Static: the text is in the delivery dictionary, the facts in `COMPANY`.
 */
export function DeliveryPage({ locale }: { locale: Locale }) {
  const dictionary = getDeliveryDictionary(locale);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.deliveryAndPayment) },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <DeliveryHero dictionary={dictionary} breadcrumbs={breadcrumbs} />

      <PageSection
        id="delivery"
        title={dictionary.delivery.title}
        label={{ index: '02', text: dictionary.delivery.label }}
      >
        <DeliveryOptions dictionary={dictionary.delivery} />
      </PageSection>

      <PageSection
        id="payment"
        title={dictionary.payment.title}
        label={{ index: '03', text: dictionary.payment.label }}
      >
        <DeliveryPayment locale={locale} dictionary={dictionary.payment} />
      </PageSection>

      <DeliveryContact
        id="delivery-contact"
        dictionary={dictionary.contact}
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
