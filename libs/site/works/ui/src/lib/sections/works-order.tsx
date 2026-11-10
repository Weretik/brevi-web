import { buttonVariants } from '@site/shared/ui';
import Link from 'next/link';

import type { WorksDictionary } from '../i18n/works-dictionary';

/** Closing block: what to do after looking at the examples. */
export function WorksOrder({
  id,
  dictionary,
  discussHref,
  productionHref,
}: {
  id: string;
  dictionary: WorksDictionary['order'];
  discussHref: string;
  productionHref: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-4 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        03 · {dictionary.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {dictionary.title}
      </h2>
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.text}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={discussHref} className={buttonVariants({ size: 'lg' })}>
          {dictionary.discuss}
        </Link>
        <Link href={productionHref} className="font-bold text-brand-text hover:underline">
          {dictionary.production} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
