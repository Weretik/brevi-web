import type { CatalogSearchIndex } from '@site/catalog/model';

/** One request per index address for the whole visit: every search box of the page shares it. */
const indexes = new Map<string, Promise<CatalogSearchIndex | null>>();

/** The search index at `url`, loaded once; a failed load is tried again on the next call. */
export function loadCatalogSearchIndex(url: string): Promise<CatalogSearchIndex | null> {
  let index = indexes.get(url);
  if (!index) {
    index = fetch(url)
      .then((response) => (response.ok ? (response.json() as Promise<CatalogSearchIndex>) : null))
      .catch(() => null);
    index.then((value) => value ?? indexes.delete(url));
    indexes.set(url, index);
  }
  return index;
}
