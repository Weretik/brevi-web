import { DEFAULT_LOCALE, LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';

/**
 * `hreflang` map for one page: every locale plus `x-default` pointing to Ukrainian. `search` is a query that
 * identifies the page itself, such as `?page=2`; filters never belong here.
 */
export function buildLanguageAlternates(path: string, search = ''): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_LANGUAGE_TAGS[locale]] = localizedPath(locale, path) + search;
  }
  languages['x-default'] = localizedPath(DEFAULT_LOCALE, path) + search;
  return languages;
}

/** Self-referencing canonical: each language version is canonical for itself, never across languages. */
export function buildCanonicalPath(locale: Locale, path: string, search = ''): string {
  return localizedPath(locale, path) + search;
}
