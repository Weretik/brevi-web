import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import type { CityDictionary } from '../i18n/city-dictionary';
import type { Company } from '@site/core/config';

/** Closing block of a city page: the call to order with the city's name, «Залишити заявку» and the phone. */
export function CityOrder({
  company,
  id,
  index,
  title,
  dictionary,
  requestHref,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  id: string;
  /** Number of the block in the «Строчка» label, for example `09`. */
  index: string;
  title: string;
  dictionary: CityDictionary;
  requestHref: string;
}) {
  const [phone] = company.phones;
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-5 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        {index} · {dictionary.order.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {title}
      </h2>
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.order.text}</p>
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
      </div>
    </section>
  );
}
