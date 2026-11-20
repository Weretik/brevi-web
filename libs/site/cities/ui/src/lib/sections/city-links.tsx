import Link from 'next/link';

type CityLink = { name: string; href: string };

/**
 * Links from a city page: the same kind of page in three nearby cities, the other kind of page in this city, and
 * «Регіони» for any other city.
 */
export function CityLinks({
  neighbours,
  pair,
  regions,
}: {
  neighbours: readonly CityLink[];
  pair: CityLink;
  regions: CityLink;
}) {
  return (
    <div className="grid gap-6">
      <ul className="flex flex-wrap gap-2.5">
        {neighbours.map((city) => (
          <li key={city.href}>
            <Link
              href={city.href}
              className="block rounded-full border border-border px-4 py-2 leading-snug font-bold hover:border-foreground"
            >
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {[pair, regions].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-bold text-brand-text hover:underline"
          >
            {link.name} <span aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
