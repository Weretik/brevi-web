import { COMPANY } from '@site/core/config';
import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';

/** Closing block of a catalog page: sewing to order, «Залишити заявку», the phone, and two related pages. */
export function CatalogOrder({
  id,
  index,
  dictionary,
  requestHref,
  logoHref,
  wholesaleHref,
}: {
  id: string;
  /** Number of the block in the «Строчка» label, for example `04`. */
  index: string;
  dictionary: CatalogDictionary['order'];
  requestHref: string;
  logoHref: string;
  wholesaleHref: string;
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
      <p className="max-w-[44rem] leading-relaxed text-muted-foreground">{dictionary.text}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          href={requestHref}
          rel="nofollow"
          className={buttonVariants({ variant: 'brand', size: 'lg' })}
        >
          {dictionary.request}
        </Link>
        <a
          href={`tel:${phone.e164}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'bg-background')}
        >
          {phone.display}
        </a>
        <Link href={logoHref} className="font-bold text-brand-text hover:underline">
          {dictionary.logo} <span aria-hidden>→</span>
        </Link>
        <Link href={wholesaleHref} className="font-bold text-brand-text hover:underline">
          {dictionary.wholesale} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
