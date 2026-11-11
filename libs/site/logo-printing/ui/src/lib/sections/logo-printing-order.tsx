import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import type { LogoPrintingDictionary } from '../i18n/logo-printing-dictionary';
import type { Company } from '@site/core/config';

/** Closing block: the four order steps, «Залишити заявку», the phone, and links to contacts and delivery. */
export function LogoPrintingOrder({
  company,
  id,
  index,
  dictionary,
  requestLabel,
  requestHref,
  contactsHref,
  deliveryHref,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  id: string;
  /** Number of the block in the «Строчка» label, for example `05`. */
  index: string;
  dictionary: LogoPrintingDictionary['order'];
  requestLabel: string;
  requestHref: string;
  contactsHref: string;
  deliveryHref: string;
}) {
  const [phone] = company.phones;
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-6 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        {index} · {dictionary.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {dictionary.title}
      </h2>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dictionary.steps.map((step, stepIndex) => (
          <li key={step.title} className="grid content-start gap-2 rounded-lg bg-background p-5">
            <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
              {String(stepIndex + 1).padStart(2, '0')}
            </span>
            <h3 className="leading-snug font-extrabold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
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
        <Link href={contactsHref} className="font-bold text-brand-text hover:underline">
          {dictionary.contacts} <span aria-hidden>→</span>
        </Link>
        <Link href={deliveryHref} className="font-bold text-brand-text hover:underline">
          {dictionary.delivery} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
