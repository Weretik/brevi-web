import { CITIES, cityText } from '@site/cities/model';
import { getCityDictionary } from '@site/cities/ui';
import { SITE_PATHS, cityPagePath, localizedPath, requestHref } from '@site/core/i18n';

import type { City } from '@site/cities/model';
import type { CityPageKind, Locale } from '@site/core/i18n';

/** The other kind of page of the same city: «Пошиття» ↔ «Робочий одяг». */
const PAIR: Record<CityPageKind, CityPageKind> = { sewing: 'workwear', workwear: 'sewing' };

/**
 * Everything both templates of a city page derive from the city, the kind and the language: the texts, the
 * links, the breadcrumbs and the three facts of the first screen (Poltava gets free pickup instead of the
 * delivery time).
 */
export function cityPageData(kind: CityPageKind, city: City, locale: Locale) {
  const dictionary = getCityDictionary(locale);
  const text = cityText(kind, city.slug, locale);
  const where = city.locative[locale];
  const kindText = dictionary.kinds[kind];
  const pageHref = (pageKind: CityPageKind, slug: string) =>
    localizedPath(locale, cityPagePath(pageKind, slug));
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const [first, second, delivery] = kindText.facts;

  return {
    dictionary,
    text,
    where,
    kindText,
    title: kindText.title(where),
    facts: city.slug === 'poltava' ? [first, second, dictionary.pickup] : [first, second, delivery],
    breadcrumbs: [
      { name: dictionary.home, href: localizedPath(locale) },
      { name: dictionary.links.regionsCrumb, href: path('regions') },
      { name: kindText.pair(where), href: pageHref(kind, city.slug) },
    ],
    links: {
      neighbours: city.neighbours.map((slug) => ({
        name: CITIES.find((item) => item.slug === slug)?.name[locale] ?? slug,
        href: pageHref(kind, slug),
      })),
      pair: {
        name: dictionary.kinds[PAIR[kind]].pair(where),
        href: pageHref(PAIR[kind], city.slug),
      },
      regions: { name: dictionary.links.regions, href: path('regions') },
    },
    requestHref: requestHref(locale),
    path,
  };
}

export type CityPageData = ReturnType<typeof cityPageData>;

/** «02», «03»…: the numbers of the «Строчка» labels in the order the blocks are rendered. */
export function blockNumbers() {
  let next = 2;
  return () => String(next++).padStart(2, '0');
}
