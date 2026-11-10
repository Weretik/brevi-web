import { COMPANY } from '@site/core/config';
import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import type { DeliveryDictionary } from '../i18n/delivery-dictionary';

/** Closing block: whom to call about delivery and payment, with both phones and a link to contacts. */
export function DeliveryContact({
  id,
  dictionary,
  contactsHref,
}: {
  id: string;
  dictionary: DeliveryDictionary['contact'];
  contactsHref: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-4 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        04 · {dictionary.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {dictionary.title}
      </h2>
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.text}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {COMPANY.phones.map((phone, index) => (
          <a
            key={phone.e164}
            href={`tel:${phone.e164}`}
            className={cn(
              buttonVariants({ variant: index === 0 ? 'default' : 'outline', size: 'lg' }),
              'font-mono',
              index > 0 && 'bg-background',
            )}
          >
            {phone.display}
          </a>
        ))}
        <Link href={contactsHref} className="font-bold text-brand-text hover:underline">
          {dictionary.contacts} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
