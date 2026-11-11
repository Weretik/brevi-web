import { seoAreaLabels, seoProblemText } from '@admin/content/model';

import { toDeskList } from './desk-list';

import type { DashboardMetric } from './dashboard-view';
import type { DeskList, DeskListRow } from './desk-list';
import type { SeoArea, SeoOverview } from '@admin/content/model';

/** Admin pages of «Контент» where a page of the site is fixed. */
export const seoAreaPaths: Record<SeoArea, string> = {
  Product: '/content/products',
  Category: '/content/categories',
  Article: '/content/articles',
  Page: '/content/site-pages',
};

/** «Що виправити для пошуку»: a page with its first problem; more problems of the page are counted. */
export function seoFixList(overview: SeoOverview): DeskList {
  return toDeskList(
    overview.issues
      .filter((issue) => issue.problems.length > 0)
      .map<DeskListRow>((issue) => {
        const [first, ...rest] = issue.problems;
        const text =
          rest.length > 0 ? `${seoProblemText(first)} · ще ${rest.length}` : seoProblemText(first);
        return {
          key: `${issue.area}-${issue.id}`,
          name: `${seoAreaLabels[issue.area]}: ${issue.name}`,
          href: seoAreaPaths[issue.area],
          mark: { text, tone: 'warning' },
        };
      }),
  );
}

/** One figure per part of the site: how many pages it shows, and how many of them still miss something. */
export function seoMetrics(overview: SeoOverview): DashboardMetric[] {
  return overview.areas.map((area) => ({
    label: seoAreaLabels[area.area],
    value: String(area.onSite),
    ...(area.withProblems > 0
      ? { note: { text: `з проблемами: ${area.withProblems}`, tone: 'error' as const } }
      : {}),
  }));
}
