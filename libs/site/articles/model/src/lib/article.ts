import type { Locale } from '@site/core/i18n';

type Localized<T> = Record<Locale, T>;

/** One piece of an article body, in reading order. */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'image'; src: string; alt: string; width: number; height: number };

export type Article = {
  /** URL slug, the same in both languages: `/uk/articles/<slug>` and `/ru/articles/<slug>`. */
  slug: string;
  /** ISO date of publication. */
  date: string;
  title: Localized<string>;
  /** One or two sentences for the list card and the meta description. */
  excerpt: Localized<string>;
  body: Localized<readonly ArticleBlock[]>;
};
