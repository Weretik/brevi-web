import { COMPANY } from '@site/core/config';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';
import type { Locale } from '@site/core/i18n';

/** Company contacts from `COMPANY`: phones, email, address with the service area, and working hours. */
export function ContactsInfo({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ContactsDictionary['info'];
}) {
  const { address, openingHours } = COMPANY;

  return (
    <address className="grid content-start gap-5 rounded-xl border border-border p-5 not-italic sm:p-6">
      <div className="grid gap-1.5">
        <span className="text-sm text-muted-foreground">{dictionary.phones}</span>
        {COMPANY.phones.map((phone) => (
          <a
            key={phone.e164}
            href={`tel:${phone.e164}`}
            className="justify-self-start font-mono text-xl font-semibold hover:text-brand-text"
          >
            {phone.display}
          </a>
        ))}
      </div>
      <div className="grid gap-1.5">
        <span className="text-sm text-muted-foreground">{dictionary.email}</span>
        <a
          href={`mailto:${COMPANY.email}`}
          className="justify-self-start font-semibold hover:text-brand-text"
        >
          {COMPANY.email}
        </a>
      </div>
      <div className="grid gap-1.5">
        <span className="text-sm text-muted-foreground">{dictionary.address}</span>
        <p className="font-semibold">
          {dictionary.country}, {dictionary.cityPrefix} {address.city[locale]},{' '}
          {address.street[locale]}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{dictionary.service}</p>
      </div>
      <div className="grid gap-1.5 border-t-2 border-dashed border-brand-soft pt-5">
        <span className="text-sm text-muted-foreground">{dictionary.hours}</span>
        <dl className="grid gap-1">
          <div className="flex flex-wrap gap-x-3">
            <dt>{dictionary.weekdays}:</dt>
            <dd className="font-mono font-semibold">
              {openingHours.opens}–{openingHours.closes}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt>{dictionary.weekend}:</dt>
            <dd className="font-semibold">{dictionary.dayOff}</dd>
          </div>
        </dl>
      </div>
    </address>
  );
}
