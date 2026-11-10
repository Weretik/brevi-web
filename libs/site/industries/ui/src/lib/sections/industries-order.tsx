import { COMPANY } from '@site/core/config';
import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import type { IndustriesDictionary } from '../i18n/industries-dictionary';

/** Closing block: the call to order, «Залишити заявку», the phone, and links to wholesale prices and contacts. */
export function IndustriesOrder({
  id,
  index,
  dictionary,
  requestLabel,
  requestHref,
  wholesaleHref,
  contactsHref,
}: {
  id: string;
  /** Number of the block in the «Строчка» label, for example `05`. */
  index: string;
  dictionary: IndustriesDictionary['order'];
  requestLabel: string;
  requestHref: string;
  wholesaleHref: string;
  contactsHref: string;
}) {
  const [phone] = COMPANY.phones;
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-5 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        {index} · {dictionary.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {dictionary.title}
      </h2>
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.text}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          href={requestHref}
          rel="nofollow"
          className={buttonVariants({ variant: 'brand', size: 'lg' })}
        >
          {requestLabel}
        </Link>
        <a
          href={`tel:${phone.e164}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'bg-background')}
        >
          {phone.display}
        </a>
        <Link href={wholesaleHref} className="font-bold text-brand-text hover:underline">
          {dictionary.wholesale} <span aria-hidden>→</span>
        </Link>
        <Link href={contactsHref} className="font-bold text-brand-text hover:underline">
          {dictionary.contacts} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
