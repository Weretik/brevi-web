import type { RegionsDictionary } from '../i18n/regions-dictionary';

/** Cities Brevi ships to, as plain text chips, and a note that the list is not a limit. */
export function RegionsCities({ dictionary }: { dictionary: RegionsDictionary['cities'] }) {
  return (
    <div className="grid gap-6">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ul className="flex flex-wrap gap-2.5">
        {dictionary.items.map((city) => (
          <li
            key={city}
            className="rounded-full border border-border px-4 py-2 leading-snug font-bold"
          >
            {city}
          </li>
        ))}
      </ul>
      <p className="max-w-[52rem] text-sm leading-relaxed text-muted-foreground">
        {dictionary.note}
      </p>
    </div>
  );
}
