import type { OldSiteImportNote } from '../product-pages/old-site-import';

/** What the transfer of the old-site category tree would do (`dryRun`) or did. */
export interface SiteCategoryImportReport {
  dryRun: boolean;
  total: number;
  created: number;
  /** Categories whose texts were replaced. */
  updated: number;
  /** Categories that already existed and were left as they are. */
  kept: number;
  /** Products added to categories. */
  productLinks: number;
  /** Old-site products without a product in «Товари». */
  notMatched: OldSiteImportNote[];
  /** Categories left out, with the reason; `url` holds the category address. */
  problems: OldSiteImportNote[];
}

export const siteCategoryImportMaxItems = 300;
