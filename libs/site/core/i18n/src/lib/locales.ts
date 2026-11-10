export const LOCALES = ['uk', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'uk';

/** BCP 47 codes for `hreflang`, `<html lang>`, and Open Graph `locale`. */
export const LOCALE_LANGUAGE_TAGS: Record<Locale, string> = {
  uk: 'uk-UA',
  ru: 'ru-UA',
};

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  uk: 'uk_UA',
  ru: 'ru_UA',
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);
