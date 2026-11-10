import { COMPANY } from '@site/core/config';
import Link from 'next/link';

import type { RegionsDictionary } from '../i18n/regions-dictionary';
import type { Locale } from '@site/core/i18n';

/** What a buyer in Poltava gets: pickup, a courier, the workshop nearby, and the address. */
export function RegionsLocal({
  dictionary,
  locale,
  contactsHref,
  productionHref,
}: {
  dictionary: RegionsDictionary['local'];
  locale: Locale;
  contactsHref: string;
  productionHref: string;
}) {
  const { city, street } = COMPANY.address;

  return (
    <div className="grid gap-8">
      <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-3">
        {dictionary.items.map((item) => (
          <li
            key={item.title}
            className="grid content-start gap-1.5 border-t-2 border-dashed border-brand-soft pt-4"
          >
            <h3 className="leading-snug font-extrabold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-bold">
        <span className="font-normal text-muted-foreground">
          {city[locale]}, {street[locale]}
        </span>
        <Link href={contactsHref} className="text-brand-text hover:underline">
          {dictionary.contacts} <span aria-hidden>→</span>
        </Link>
        <Link href={productionHref} className="text-brand-text hover:underline">
          {dictionary.production} <span aria-hidden>→</span>
        </Link>
      </p>
    </div>
  );
}
