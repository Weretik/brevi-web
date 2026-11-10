import { COMPANY } from '@site/core/config';
import { StitchLabel, buttonVariants, cn } from '@site/shared/ui';
import Image from 'next/image';

import type { HomeDictionary } from '../i18n/home-dictionary';

/** Callout dots on the product photo, in percent of the photo box; the order matches `hero.callouts`. */
const CALLOUT_POSITIONS = [
  { left: '42%', top: '28%' },
  { left: '34%', top: '44%' },
  { left: '60%', top: '62%' },
  { left: '42%', top: '77%' },
] as const;

/** First screen of the «Строчка» mockup: offer, three facts, two actions, and a product photo with numbered callouts. */
export function HomeHero({
  dictionary,
  requestHref,
}: {
  dictionary: HomeDictionary['hero'];
  /** Where «Залишити заявку» leads; the contacts block until the request page exists. */
  requestHref: string;
}) {
  const [salesPhone] = COMPANY.phones;

  return (
    <section className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="grid gap-5">
        <StitchLabel index="01">{dictionary.label}</StitchLabel>
        <h1 className="text-[2.125rem] leading-[1.06] font-extrabold tracking-[-0.025em] sm:text-[3.125rem]">
          {dictionary.title}
        </h1>
        <p className="max-w-[32.5rem] text-lg leading-relaxed text-muted-foreground">
          {dictionary.lead}
        </p>
        <dl className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border">
          {dictionary.facts.map((fact) => (
            <div key={fact.value} className="flex flex-col-reverse justify-end px-3 py-3.5 sm:px-4">
              <dt className="mt-0.5 text-[0.8125rem] text-muted-foreground">{fact.note}</dt>
              <dd className="font-mono text-base font-semibold sm:text-xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center gap-3">
          <a href={requestHref} className={buttonVariants({ size: 'lg' })}>
            {dictionary.request}
          </a>
          <a
            href={`tel:${salesPhone.e164}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'font-mono')}
          >
            <span aria-hidden className="size-2 rounded-full bg-[#1e9a4a]" />
            {salesPhone.display}
          </a>
        </div>
      </div>

      <figure className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="relative aspect-square rounded-xl border-2 border-dashed border-brand-soft bg-background">
          <Image
            src="/assets/home/impulse-suit-front.webp"
            alt={dictionary.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 60vw, 100vw"
            className="rounded-xl object-contain"
          />
          {CALLOUT_POSITIONS.map((position, index) => (
            <span
              key={position.top}
              aria-hidden
              style={position}
              className="absolute grid size-[1.625rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground shadow-[0_0_0_3px_var(--background),0_0_0_5px_var(--brand)]"
            >
              {index + 1}
            </span>
          ))}
        </div>
        <figcaption className="grid gap-3.5">
          <span className="font-mono text-xs text-muted-foreground uppercase">
            {dictionary.caption}
          </span>
          <ol className="grid gap-3.5">
            {dictionary.callouts.map((callout, index) => (
              <li key={callout.title} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="grid size-[1.375rem] flex-none place-items-center rounded-full bg-primary font-mono text-[0.6875rem] font-semibold text-primary-foreground"
                >
                  {index + 1}
                </span>
                <span className="text-sm leading-snug">
                  <strong className="block">{callout.title}</strong>
                  <span className="text-[0.8125rem] text-muted-foreground">{callout.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>
    </section>
  );
}
