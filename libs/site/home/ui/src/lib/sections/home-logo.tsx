import { StitchLabel } from '@site/shared/ui';
import Image from 'next/image';
import Link from 'next/link';

import type { HomeDictionary } from '../i18n/home-dictionary';

/** «Логотип на формі»: the suit from the back with the logo area outlined, and the three ways to apply a logo. */
export function HomeLogo({
  dictionary,
  moreHref,
}: {
  dictionary: HomeDictionary['logo'];
  moreHref: string;
}) {
  return (
    <section
      aria-labelledby="home-logo-title"
      className="grid items-center gap-8 rounded-xl border border-border p-5 sm:p-7 md:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)]"
    >
      <div className="relative aspect-square">
        <Image
          src="/assets/home/impulse-suit-back.webp"
          alt={dictionary.imageAlt}
          fill
          sizes="(min-width: 768px) 360px, 100vw"
          className="object-contain"
        />
        <span
          aria-hidden
          className="absolute top-[19%] left-[39%] grid h-[9%] w-[22%] place-items-center rounded-md border-2 border-dashed border-brand bg-background/85 font-mono text-[0.625rem] font-semibold uppercase"
        >
          {dictionary.mark}
        </span>
      </div>
      <div className="grid gap-4">
        <StitchLabel index="03">{dictionary.label}</StitchLabel>
        <h2
          id="home-logo-title"
          className="text-2xl leading-[1.15] font-extrabold tracking-[-0.015em] sm:text-[1.875rem]"
        >
          {dictionary.title}
        </h2>
        <ul className="grid gap-2.5 sm:grid-cols-3">
          {dictionary.methods.map((method) => (
            <li key={method.title} className="rounded-xl bg-muted p-4">
              <strong className="block font-extrabold">{method.title}</strong>
              <span className="mt-1 block text-[0.8125rem] leading-normal text-muted-foreground">
                {method.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">{dictionary.note}</p>
        <Link
          href={moreHref}
          className="justify-self-start font-bold text-brand-text hover:underline"
        >
          {dictionary.more} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
