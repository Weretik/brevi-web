import Image from 'next/image';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** Client managers of «Контакти та компанія»: photo, name, phones, and email. */
export function ContactsManagers({
  company,
  locale,
  dictionary,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  locale: Locale;
  dictionary: ContactsDictionary['managers'];
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {company.managers.map((manager) => (
        <li
          key={`${manager.name.uk}-${manager.phones[0]?.e164 ?? ''}`}
          className="flex items-start gap-5 rounded-xl border border-border p-5"
        >
          {manager.photo && (
            <Image
              src={manager.photo}
              alt={`${manager.name[locale]}, ${dictionary.photoAlt}`}
              width={112}
              height={112}
              unoptimized={manager.photo.startsWith('https://')}
              className="size-24 flex-none rounded-lg object-cover sm:size-28"
            />
          )}
          <div className="grid min-w-0 gap-2">
            <h3 className="text-lg leading-snug font-extrabold">{manager.name[locale]}</h3>
            <span className="text-sm text-muted-foreground">{dictionary.phones}</span>
            {manager.phones.map((phone) => (
              <a
                key={phone.e164}
                href={`tel:${phone.e164}`}
                className="justify-self-start font-mono text-lg font-semibold hover:text-brand-text"
              >
                {phone.display}
              </a>
            ))}
            {manager.email && (
              <a
                href={`mailto:${manager.email}`}
                className="justify-self-start text-sm break-all hover:text-brand-text"
              >
                {manager.email}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
