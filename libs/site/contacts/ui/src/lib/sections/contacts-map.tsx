import type { ContactsDictionary } from '../i18n/contacts-dictionary';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** Google map of the workshop address, loaded lazily, with a link that opens the place in Maps. */
export function ContactsMap({
  company,
  locale,
  dictionary,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  locale: Locale;
  dictionary: ContactsDictionary['info'];
}) {
  const mapQuery = encodeURIComponent(company.mapQuery);
  return (
    <div className="grid content-start gap-3">
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-brand-soft">
        <iframe
          title={dictionary.mapTitle}
          src={`https://www.google.com/maps?q=${mapQuery}&hl=${locale}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block aspect-[4/3] w-full border-0"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="justify-self-start font-bold text-brand-text hover:underline"
      >
        {dictionary.openMap} <span aria-hidden>→</span>
      </a>
    </div>
  );
}
