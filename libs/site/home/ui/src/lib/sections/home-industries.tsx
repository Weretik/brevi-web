import Link from 'next/link';

import type { HomeDictionary } from '../i18n/home-dictionary';

/** Industries as link cards; each opens the industries hub until the industry pages exist. */
export function HomeIndustries({
  items,
  href,
}: {
  items: HomeDictionary['industries']['items'];
  href: string;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.title}>
          <Link
            href={href}
            className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border px-5 py-4 transition-colors hover:border-border-strong hover:bg-muted"
          >
            <span>
              <span className="block font-extrabold">{item.title}</span>
              <span className="text-[0.8125rem] text-muted-foreground">{item.text}</span>
            </span>
            <span aria-hidden className="font-extrabold text-brand-text">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
