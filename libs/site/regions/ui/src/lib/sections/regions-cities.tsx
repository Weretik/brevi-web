import { CITIES } from '@site/cities/model';
import { cityPagePath, localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import type { RegionsDictionary } from '../i18n/regions-dictionary';
import type { CityPageKind, Locale } from '@site/core/i18n';

const KINDS: readonly CityPageKind[] = ['sewing', 'workwear'];

/**
 * Cities Brevi ships to: a city with its own pages links to «Пошиття» and «Робочий одяг» there, any other city is
 * plain text; a note says the list is not a limit.
 */
export function RegionsCities({
  dictionary,
  locale,
}: {
  dictionary: RegionsDictionary['cities'];
  locale: Locale;
}) {
  return (
    <div className="grid gap-6">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {dictionary.items.map((name) => {
          const city = CITIES.find((item) => item.name[locale] === name);
          return (
            <li key={name} className="grid gap-1 rounded-xl border border-border px-4 py-3">
              <span className="leading-snug font-bold">{name}</span>
              {city ? (
                <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {KINDS.map((kind) => (
                    <Link
                      key={kind}
                      href={localizedPath(locale, cityPagePath(kind, city.slug))}
                      aria-label={`${dictionary[kind]} ${city.locative[locale]}`}
                      className="font-semibold text-brand-text hover:underline"
                    >
                      {dictionary[kind]}
                    </Link>
                  ))}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="max-w-[52rem] text-sm leading-relaxed text-muted-foreground">
        {dictionary.note}
      </p>
    </div>
  );
}
