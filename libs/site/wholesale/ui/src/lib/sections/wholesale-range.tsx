import Link from 'next/link';

import type { WholesaleDictionary } from '../i18n/wholesale-dictionary';

/** What can be ordered in bulk: three groups of goods and links to the catalog and logo branding. */
export function WholesaleRange({
  dictionary,
  catalogHref,
  logoHref,
}: {
  dictionary: WholesaleDictionary['range'];
  catalogHref: string;
  logoHref: string;
}) {
  return (
    <div className="grid gap-8">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
        {dictionary.groups.map((group) => (
          <li key={group.title} className="grid content-start gap-3 bg-background p-5 sm:p-6">
            <h3 className="leading-snug font-extrabold">{group.title}</h3>
            <ul className="flex flex-wrap gap-2 text-sm">
              {group.items.map((item) => (
                <li key={item} className="rounded-full bg-muted px-3 py-1.5 leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
        <Link href={catalogHref} className="text-brand-text hover:underline">
          {dictionary.catalog} <span aria-hidden>→</span>
        </Link>
        <Link href={logoHref} className="text-brand-text hover:underline">
          {dictionary.logo} <span aria-hidden>→</span>
        </Link>
      </p>
    </div>
  );
}
