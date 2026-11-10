'use client';

import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath, switchLocalePath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { Locale } from '@site/core/i18n';

const LABELS: Record<Locale, string> = { uk: 'UA', ru: 'RU' };

/**
 * Language toggle: two links in one pill, the current language filled.
 * Each link opens the same page in that language; the private request page stays nofollow.
 */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const privatePage = LOCALES.some(
    (supported) => pathname.replace(/\/+$/, '') === localizedPath(supported, SHELL_PATHS.request),
  );

  return (
    <nav
      aria-label={label}
      className="flex shrink-0 items-center rounded-full border border-border-strong bg-background p-0.5 font-mono text-xs font-semibold"
    >
      {LOCALES.map((target) => (
        <Link
          key={target}
          href={switchLocalePath(pathname, target)}
          hrefLang={LOCALE_LANGUAGE_TAGS[target]}
          rel={privatePage ? 'nofollow' : undefined}
          aria-current={target === locale ? 'true' : undefined}
          className={cn(
            'flex h-8 min-w-10 items-center justify-center rounded-full px-2.5 transition-colors',
            target === locale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {LABELS[target]}
        </Link>
      ))}
    </nav>
  );
}
