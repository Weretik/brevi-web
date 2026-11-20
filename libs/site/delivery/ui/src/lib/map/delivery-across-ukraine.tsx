import { StitchLabel } from '@site/shared/ui';
import Link from 'next/link';

import { UkraineMap } from './ukraine-map';

import type { DeliveryDictionary } from '../i18n/delivery-dictionary';

/**
 * «Працюємо по всій Україні»: the text on delivery by Nova Poshta and SAT on one side, the map with routes
 * from Poltava on the other. `moreHref` links to «Доставка та оплата»; that page itself leaves it out.
 */
export function DeliveryAcrossUkraine({
  id,
  index,
  dictionary,
  moreHref,
}: {
  id: string;
  /** Number of the block in the page's «Строчка» labels, for example `06`. */
  index: string;
  dictionary: DeliveryDictionary['acrossUkraine'];
  moreHref?: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid items-center gap-8 rounded-2xl border border-border bg-background p-6 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:p-10"
    >
      <div className="grid gap-5">
        <StitchLabel index={index}>{dictionary.label}</StitchLabel>
        <h2
          id={titleId}
          className="text-2xl leading-[1.15] font-extrabold tracking-[-0.015em] sm:text-[1.875rem]"
        >
          {dictionary.title}
        </h2>
        <p className="leading-relaxed text-muted-foreground">{dictionary.text}</p>
        <ul className="grid gap-3">
          {dictionary.facts.map((fact) => (
            <li key={fact.value} className="grid border-l-2 border-brand pl-3.5">
              <span className="font-extrabold">{fact.value}</span>
              <span className="text-sm text-muted-foreground">{fact.text}</span>
            </li>
          ))}
        </ul>
        {moreHref ? (
          <Link href={moreHref} className="font-bold text-brand-text hover:underline">
            {dictionary.more} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
      <UkraineMap
        label={dictionary.mapLabel}
        production={dictionary.production}
        productionNote={dictionary.productionNote}
        cities={dictionary.cities}
      />
    </section>
  );
}
