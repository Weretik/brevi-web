import type { CatalogProductType } from './catalog-tree';

/** A product as the search knows it: enough for a suggestion and its link. */
export type CatalogSearchProduct = {
  slug: string;
  name: string;
  code: string | null;
  type: CatalogProductType;
  image: string | null;
  priceFrom: number | null;
  /** Localized address of the product page. */
  href: string;
};

/** A category as the search knows it, with the name of its parent for «Спецодяг зимовий → Жилети». */
export type CatalogSearchSection = {
  slug: string;
  name: string;
  parent: string | null;
  productCount: number;
  href: string;
};

/** What the search box loads once: every product and category of the site in the language of the page. */
export type CatalogSearchIndex = {
  products: readonly CatalogSearchProduct[];
  sections: readonly CatalogSearchSection[];
};

/** Latin letters that look like Cyrillic ones: a name typed as «Жилет ЛIДЕР» or «оrange» still matches. */
const LOOKALIKES: Record<string, string> = {
  a: 'а',
  c: 'с',
  e: 'е',
  i: 'і',
  k: 'к',
  m: 'м',
  o: 'о',
  p: 'р',
  x: 'х',
  y: 'у',
  h: 'н',
  t: 'т',
  b: 'в',
};

/**
 * Lower case without apostrophes, with «ё» as «е», «ї» as «і», «ы» as «и», and Latin look-alikes as Cyrillic.
 * Both the query and the text go through it, so «кур’єр», «курєр», and «KУРЄР» find the same model.
 */
export function normalizeCatalogText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’ʼ`]/g, '')
    .replace(/ё/g, 'е')
    .replace(/ї/g, 'і')
    .replace(/ы/g, 'и')
    .replace(/[a-z]/g, (letter) => LOOKALIKES[letter] ?? letter);
}

/** Words of a query: letters and digits; «6-ти», «МБС/нітрил», and «1 042» split into searchable parts. */
export function catalogQueryWords(query: string): readonly string[] {
  return normalizeCatalogText(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 0);
}

/**
 * How well a text answers the words: `0` when a word is missing, otherwise more for words that start a word
 * of the text («кур» in «Куртка») than for words found inside one («тка» in «Куртка»).
 */
function score(text: string, words: readonly string[]): number {
  const normalized = normalizeCatalogText(text);
  const starts = normalized.split(/[^\p{L}\p{N}]+/u);
  let total = 0;
  for (const word of words) {
    if (!normalized.includes(word)) return 0;
    total += starts.some((part) => part.startsWith(word)) ? 2 : 1;
  }
  return total;
}

function rank<T>(items: readonly T[], words: readonly string[], text: (item: T) => string): T[] {
  if (words.length === 0) return [];
  return items
    .map((item, index) => ({ item, index, score: score(text(item), words) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.item);
}

/** Products whose name or model number has every word of the query, best matches first. */
export function searchCatalogProducts<T extends { name: string; code: string | null }>(
  products: readonly T[],
  query: string,
): T[] {
  return rank(products, catalogQueryWords(query), (product) =>
    [product.name, product.code ?? ''].join(' '),
  );
}

/** Categories whose name, together with the name of the parent, has every word of the query. */
export function searchCatalogSections<T extends { name: string; parent: string | null }>(
  sections: readonly T[],
  query: string,
): T[] {
  return rank(sections, catalogQueryWords(query), (section) =>
    [section.name, section.parent ?? ''].join(' '),
  );
}
