import { COMPANY } from '@site/core/config';
import { StitchLabel, buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import type { RequestDictionary } from '../i18n/request-dictionary';

/** Shown instead of the form after a request is accepted: repeats the number and says when to expect the call. */
export function RequestSent({
  dictionary,
  phone,
  catalogHref,
  onAgain,
}: {
  dictionary: RequestDictionary['sent'];
  /** Already formatted for reading, for example `+380 50 123 45 67`. */
  phone: string;
  catalogHref: string;
  onAgain: () => void;
}) {
  const [companyPhone] = COMPANY.phones;

  return (
    <div
      role="status"
      className="grid gap-5 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <StitchLabel index="02">{dictionary.label}</StitchLabel>
      <h2 className="text-2xl leading-tight font-extrabold tracking-[-0.015em] sm:text-[1.75rem]">
        {dictionary.title}
      </h2>
      <p className="leading-relaxed text-muted-foreground">
        {dictionary.textBefore}{' '}
        <strong className="whitespace-nowrap text-foreground">{phone}</strong>.{' '}
        {dictionary.textAfter}
      </p>
      <p className="text-[0.9375rem] text-muted-foreground">
        {dictionary.wrongNumber}{' '}
        <button
          type="button"
          onClick={onAgain}
          className="min-h-11 font-bold text-brand-text hover:underline"
        >
          {dictionary.again}
        </button>
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href={catalogHref} className={buttonVariants({ size: 'lg' })}>
          {dictionary.catalog}
        </Link>
        <a
          href={`tel:${companyPhone.e164}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'bg-background')}
        >
          {dictionary.call}
        </a>
      </div>
    </div>
  );
}
