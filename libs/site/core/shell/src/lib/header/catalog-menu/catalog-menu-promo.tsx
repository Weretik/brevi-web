'use client';

import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** The logo sewing card of the catalog menu, shown on wide screens. */
export function CatalogMenuPromo({
  locale,
  dictionary,
  onNavigate,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  onNavigate: () => void;
}) {
  return (
    <aside className="m-4 ml-0 flex flex-col gap-3 rounded-xl bg-primary p-6 text-primary-foreground max-xl:hidden">
      <p className="font-mono text-xs font-semibold tracking-wider text-brand-soft uppercase">
        {dictionary.promoLabel}
      </p>
      <p className="text-xl leading-tight font-extrabold">{dictionary.promoTitle}</p>
      <p className="text-[0.9375rem] leading-normal text-primary-foreground/80">
        {dictionary.promoText}
      </p>
      <Link
        href={localizedPath(locale, SHELL_PATHS.logoPrinting)}
        onClick={onNavigate}
        className="mt-auto font-bold text-brand-soft hover:underline"
      >
        {dictionary.promoLink} <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
