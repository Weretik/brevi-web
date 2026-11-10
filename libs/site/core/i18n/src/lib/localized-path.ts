import { LOCALES, isLocale } from './locales';

import type { Locale } from './locales';

const normalizePath = (path: string): string => {
  const withoutQuery = path.split(/[?#]/)[0] ?? '';
  const trimmed = withoutQuery.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
};

/** Builds a site path such as `/uk/catalog/kurtky` from a locale-free path; the home page is `/uk`. */
export function localizedPath(locale: Locale, path = '/'): string {
  return `/${locale}${normalizePath(path)}`;
}

/** Removes the locale prefix: `/ru/contacts` becomes `/contacts`, `/uk` becomes `/`. */
export function stripLocale(pathname: string): string {
  const [first, ...rest] = normalizePath(pathname).split('/').filter(Boolean);
  const segments = first && isLocale(first) ? rest : [first, ...rest].filter(Boolean);
  return segments.length ? `/${segments.join('/')}` : '/';
}

/** The same page in another language, used by the language switch. */
export function switchLocalePath(pathname: string, locale: Locale): string {
  return localizedPath(locale, stripLocale(pathname));
}

/** Paths of one page in every locale, keyed by locale. */
export function localizedPaths(path: string): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, localizedPath(locale, path)]),
  ) as Record<Locale, string>;
}
