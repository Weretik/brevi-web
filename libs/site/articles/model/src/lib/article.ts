import type { Locale } from '@site/core/i18n';

/** A picture of an article on the CDN of the «Фото» library; the size is known for most photos. */
export type ArticlePhoto = {
  src: string;
  /** The small copy for cards; null until the library has made it. */
  thumbnail: string | null;
  width: number | null;
  height: number | null;
};

/**
 * One piece of an article text, in reading order. Texts may hold bold and italic as `**…**` and `*…*`,
 * the way the visual editor of the Admin keeps them.
 */
export type ArticleBlock =
  | { type: 'paragraph'; text: string; lead: string | null }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'image'; photo: ArticlePhoto; alt: string };

/** An article in the list, in one language. */
export type ArticleCard = {
  /** URL slug, the same in both languages: `/uk/articles/<slug>` and `/ru/articles/<slug>`. */
  slug: string;
  /** ISO date of publication. */
  date: string;
  /** The language of the texts: the page language, or Ukrainian for an article without Russian texts. */
  textLocale: Locale;
  title: string;
  /** One or two sentences for the card and, without SEO, for the meta description. */
  excerpt: string;
  cover: ArticlePhoto | null;
  hasRussian: boolean;
  /** ISO time of the last change, for the sitemap. */
  updatedAt: string;
};

/** An article page in one language. */
export type Article = ArticleCard & {
  /** What staff wrote for search; empty strings when they wrote nothing. */
  seo: { title: string; description: string };
  body: readonly ArticleBlock[];
};
