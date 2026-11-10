import { COMPANY } from '@site/core/config';
import { buttonVariants } from '@site/shared/ui';
import Link from 'next/link';

import type { HomeDictionary } from '../i18n/home-dictionary';
import type { Locale } from '@site/core/i18n';

/**
 * «Контакти»: phones, hours, and address on the left; on the right what to tell the manager and two actions.
 * The request form of the mockup replaces the right side when the site can send requests.
 */
export function HomeContacts({
  id,
  locale,
  dictionary,
  contactsHref,
}: {
  id: string;
  locale: Locale;
  dictionary: HomeDictionary['contacts'];
  contactsHref: string;
}) {
  const [salesPhone] = COMPANY.phones;
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid scroll-mt-24 overflow-hidden rounded-xl border-2 border-dashed border-brand-soft md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
    >
      <address className="grid content-start gap-3 bg-muted p-6 not-italic sm:p-8">
        <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
          06 · {dictionary.label}
        </p>
        <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
          {dictionary.title}
        </h2>
        {COMPANY.phones.map((phone) => (
          <a
            key={phone.e164}
            href={`tel:${phone.e164}`}
            className="justify-self-start font-mono text-xl font-semibold hover:text-brand-text"
          >
            {phone.display}
          </a>
        ))}
        <a href={`mailto:${COMPANY.email}`} className="justify-self-start hover:text-brand-text">
          {COMPANY.email}
        </a>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {COMPANY.openingHours.label[locale]}
          <br />
          {COMPANY.address.city[locale]}, {COMPANY.address.street[locale]}
        </p>
        <Link
          href={contactsHref}
          className="justify-self-start font-bold text-brand-text hover:underline"
        >
          {dictionary.findUs} <span aria-hidden>→</span>
        </Link>
      </address>
      <div className="grid content-start gap-4 p-6 sm:p-8">
        <h3 className="text-lg font-extrabold">{dictionary.requestTitle}</h3>
        <ol className="grid gap-3">
          {dictionary.requestPoints.map((point, index) => (
            <li key={point} className="flex items-start gap-3">
              <span
                aria-hidden
                className="grid size-6 flex-none place-items-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <span className="leading-snug">{point}</span>
            </li>
          ))}
        </ol>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a href={`tel:${salesPhone.e164}`} className={buttonVariants({ size: 'lg' })}>
            {dictionary.call}
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            {dictionary.write}
          </a>
          <span className="text-[0.8125rem] text-muted-foreground">{dictionary.note}</span>
        </div>
      </div>
    </section>
  );
}
