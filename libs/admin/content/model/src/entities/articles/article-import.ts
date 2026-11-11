import type { OldSiteImportNote } from '../product-pages/old-site-import';

/** What the transfer of old-site articles would do (`dryRun`) or did. */
export interface ArticleImportReport {
  dryRun: boolean;
  total: number;
  created: number;
  /** Articles whose texts were replaced. */
  updated: number;
  /** Articles that already existed and were left as they are. */
  kept: number;
  /** Pictures the transfer would bring into «Фото» (`dryRun`) or brought. */
  photos: number;
  /** Always empty: an article does not look for a pair. Kept for the shared dialog. */
  notMatched: OldSiteImportNote[];
  /** Articles or pictures left out, with the reason. */
  problems: OldSiteImportNote[];
}

export const articleImportMaxItems = 200;

/** Articles sent in one request of the real transfer: pictures are downloaded while it runs. */
export const articleImportBatchSize = 3;
