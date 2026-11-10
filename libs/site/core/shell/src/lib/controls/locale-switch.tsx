'use client';

import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath, switchLocalePath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { Locale } from '@site/core/i18n';

const LABELS: Record<Locale, string> = { uk: 'UA', ru: 'RU' };

/** «UA / RU» links to the same page in the other language; the private request page stays nofollow. */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const privatePage = LOCALES.some(
    (supported) => pathname.replace(/\/+$/, '') === localizedPath(supported, SHELL_PATHS.request),
  );

  return (
    <nav aria-label={label} className="flex items-center gap-1.5 text-[0.8125rem] font-bold">
      {LOCALES.map((target, index) => (
        <Fragment key={target}>
          {index > 0 && (
            <span aria-hidden className="text-border-strong">
              /
            </span>
          )}
          <Link
            href={switchLocalePath(pathname, target)}
            hrefLang={LOCALE_LANGUAGE_TAGS[target]}
            rel={privatePage ? 'nofollow' : undefined}
            aria-current={target === locale ? 'true' : undefined}
            className={cn(
              'rounded-sm px-0.5 py-1 transition-colors',
              target === locale ? 'text-foreground' : 'text-muted-foreground hover:text-brand-text',
            )}
          >
            {LABELS[target]}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
