import type { SiteRedirect, SiteRedirectSource } from '../../entities/redirects/site-redirect';

const sourceLabels: Record<SiteRedirectSource, string> = {
  Manual: 'Вручну',
  OldSite: 'Старий сайт',
  SlugChange: 'Зміна адреси',
};

export function redirectSourceLabel(source: SiteRedirectSource): string {
  return sourceLabels[source];
}

/** Redirects whose addresses or note contain the term, of the chosen source (null for all). */
export function filterRedirects(
  rows: readonly SiteRedirect[],
  term: string,
  source: SiteRedirectSource | null,
): SiteRedirect[] {
  const needle = term.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (source === null || row.source === source) &&
      (needle === '' ||
        row.fromPath.includes(needle) ||
        row.toPath.includes(needle) ||
        (row.note ?? '').toLowerCase().includes(needle)),
  );
}
