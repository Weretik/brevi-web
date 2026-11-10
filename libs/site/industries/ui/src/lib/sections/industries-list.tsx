import Link from 'next/link';

import type { IndustriesDictionary } from '../i18n/industries-dictionary';

/** Industries Brevi sews for, with typical garments, and links to the works and logo pages. */
export function IndustriesList({
  dictionary,
  worksHref,
  logoHref,
}: {
  dictionary: IndustriesDictionary['list'];
  worksHref: string;
  logoHref: string;
}) {
  return (
    <div className="grid gap-8">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {dictionary.items.map((item, index) => (
          <li key={item.title} className="grid content-start gap-2 bg-background p-5">
            <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="leading-snug font-extrabold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
        <Link href={worksHref} className="text-brand-text hover:underline">
          {dictionary.works} <span aria-hidden>→</span>
        </Link>
        <Link href={logoHref} className="text-brand-text hover:underline">
          {dictionary.logo} <span aria-hidden>→</span>
        </Link>
      </p>
    </div>
  );
}
