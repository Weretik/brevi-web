import { COMPANY } from '@site/core/config';
import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import { ProductionProse } from './production-prose';

import type { ProductionDictionary } from '../i18n/production-dictionary';

/** Closing block: how to start an order, links to contacts and works, and the two main actions. */
export function ProductionOrder({
  id,
  dictionary,
  discussHref,
  contactsHref,
  worksHref,
}: {
  id: string;
  dictionary: ProductionDictionary['order'];
  discussHref: string;
  contactsHref: string;
  worksHref: string;
}) {
  const [salesPhone] = COMPANY.phones;
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-5 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        06 · {dictionary.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {dictionary.title}
      </h2>
      <ProductionProse paragraphs={dictionary.paragraphs} />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={discussHref} className={buttonVariants({ size: 'lg' })}>
          {dictionary.discuss}
        </Link>
        <a
          href={`tel:${salesPhone.e164}`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
            'bg-background font-mono',
          )}
        >
          {salesPhone.display}
        </a>
        <Link href={contactsHref} className="font-bold text-brand-text hover:underline">
          {dictionary.contacts} <span aria-hidden>→</span>
        </Link>
        <Link href={worksHref} className="font-bold text-brand-text hover:underline">
          {dictionary.works} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
