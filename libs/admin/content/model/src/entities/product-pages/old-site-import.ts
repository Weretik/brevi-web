/** One old-site page the transfer could not place, with the reason in words. */
export interface OldSiteImportNote {
  url: string;
  name: string | null;
  reason: string;
}

/** What the transfer of old-site texts would do (`dryRun`) or did. */
export interface OldSiteImportReport {
  dryRun: boolean;
  total: number;
  created: number;
  /** Pages whose texts were replaced. */
  updated: number;
  /** Pages that already had texts and were left as they are. */
  kept: number;
  notMatched: OldSiteImportNote[];
  problems: OldSiteImportNote[];
}

export interface OldSiteImportOptions {
  /** Put the transferred pages on the site; never takes a page off it. */
  showOnSite: boolean;
  /** Replace texts of pages that already have them. */
  overwrite: boolean;
}

/** Old-site pages as the transfer file holds them; the server checks their content. */
export type OldSiteImportItems = readonly Record<string, unknown>[];

export const oldSiteImportMaxItems = 500;
