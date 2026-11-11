/** Who made a redirect: staff, the old-site transfer, or an address change of a page. */
export const siteRedirectSources = ['Manual', 'OldSite', 'SlugChange'] as const;
export type SiteRedirectSource = (typeof siteRedirectSources)[number];

/** A 301 redirect of the public site: an old address and the page of the new site it leads to. */
export interface SiteRedirect {
  id: number;
  /** Normalized old address: lower case, no host, query or closing slash. */
  fromPath: string;
  /** Page of the new site under /uk or /ru. */
  toPath: string;
  source: SiteRedirectSource;
  note: string | null;
  updatedAtUtc: string;
  updatedBy: string;
}

/** What is sent to add (`id` null) or change a redirect. */
export interface SiteRedirectInput {
  id: number | null;
  fromPath: string;
  toPath: string;
  note: string | null;
}

/** One address of the old-site transfer and where it goes; `toPath` is null when no page was found. */
export interface RedirectImportRow {
  fromPath: string;
  toPath: string | null;
  note: string | null;
  result: 'Created' | 'Updated' | 'Kept' | 'Same' | 'Unresolved';
}

/** What the transfer of old-site addresses would do (`dryRun`) or did. */
export interface RedirectImportReport {
  dryRun: boolean;
  total: number;
  created: number;
  updated: number;
  kept: number;
  unresolved: number;
  rows: RedirectImportRow[];
}

/** What the signed-in staff member may do on «Контент → Переадресації» (page `content-redirects`). */
export interface RedirectsViewer {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const redirectImportMaxItems = 3000;
