import { Breadcrumbs, StitchLabel, buttonVariants } from '@site/shared/ui';
import Link from 'next/link';

import type { LogoPrintingDictionary } from '../i18n/logo-printing-dictionary';
import type { BreadcrumbItem } from '@site/shared/ui';

/** First screen: breadcrumbs, `h1`, the lead, two actions, and the order terms (minimum, time, delivery). */
export function LogoPrintingHero({
  dictionary,
  breadcrumbs,
  requestHref,
  worksHref,
}: {
  dictionary: LogoPrintingDictionary;
  breadcrumbs: readonly BreadcrumbItem[];
  requestHref: string;
  worksHref: string;
}) {
  return (
    <section className="grid gap-8 pt-6 sm:pt-8">
      <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <StitchLabel index="01">{dictionary.label}</StitchLabel>
          <h1 className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.025em] sm:text-[2.75rem]">
            {dictionary.title}
          </h1>
          {dictionary.lead.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href={requestHref}
              rel="nofollow"
              className={buttonVariants({ variant: 'brand', size: 'lg' })}
            >
              {dictionary.request}
            </Link>
            <Link href={worksHref} className="font-bold text-brand-text hover:underline">
              {dictionary.works} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <dl
          aria-label={dictionary.factsLabel}
          className="grid gap-px overflow-hidden rounded-xl border-2 border-dashed border-brand-soft bg-brand-soft"
        >
          {dictionary.facts.map((fact) => (
            <div key={fact.title} className="grid gap-1 bg-background p-5 sm:p-6">
              <dt className="order-2 text-sm text-muted-foreground">{fact.text}</dt>
              <dd className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
                {fact.title}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
