import { Breadcrumbs, StitchLabel, buttonVariants } from '@site/shared/ui';
import Image from 'next/image';
import Link from 'next/link';

import type { ProductionDictionary } from '../i18n/production-dictionary';
import type { BreadcrumbItem } from '@site/shared/ui';

/** First screen: breadcrumbs, `h1`, the two lead paragraphs, two actions, and a photo of a sewn suit. */
export function ProductionHero({
  dictionary,
  breadcrumbs,
  discussHref,
  worksHref,
}: {
  dictionary: ProductionDictionary;
  breadcrumbs: readonly BreadcrumbItem[];
  discussHref: string;
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
            <Link href={discussHref} className={buttonVariants({ size: 'lg' })}>
              {dictionary.discuss}
            </Link>
            <Link href={worksHref} className="font-bold text-brand-text hover:underline">
              {dictionary.works} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <figure className="grid gap-3">
          <div className="relative aspect-square rounded-xl border-2 border-dashed border-brand-soft bg-background">
            <Image
              src="/assets/home/impulse-suit-front.webp"
              alt={dictionary.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="rounded-xl object-contain"
            />
          </div>
          <figcaption className="font-mono text-[0.8125rem] text-muted-foreground">
            {dictionary.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
