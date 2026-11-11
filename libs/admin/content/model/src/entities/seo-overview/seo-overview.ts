import type { ContentLanguage } from '../product-pages/content-product';

/** Where a page of the site comes from in «Контент». */
export const seoAreas = ['Product', 'Category', 'Article', 'Page'] as const;
export type SeoArea = (typeof seoAreas)[number];

/** What a page shown on the site misses for search. */
export const seoProblemKinds = [
  'NoTitle',
  'NoDescription',
  'TitleTooLong',
  'DescriptionTooLong',
  'DuplicateTitle',
  'NoRussian',
] as const;
export type SeoProblemKind = (typeof seoProblemKinds)[number];

/** Site-wide settings of «Налаштування SEO сайту» that are not filled. */
export const seoSiteProblems = [
  'NoAnalytics',
  'NoGoogleVerification',
  'NoBingVerification',
  'NoSharePicture',
] as const;
export type SeoSiteProblem = (typeof seoSiteProblems)[number];

export interface SeoProblem {
  kind: SeoProblemKind;
  /** Null for a problem of the whole page. */
  language: ContentLanguage | null;
}

export interface SeoIssue {
  area: SeoArea;
  /** The product, category or article id, or the page key. */
  id: string;
  name: string;
  /** Address on the site without the language. */
  path: string;
  problems: SeoProblem[];
}

export interface SeoAreaSummary {
  area: SeoArea;
  onSite: number;
  withProblems: number;
}

/** «Контент → SEO-огляд»: only what the site misses for search. */
export interface SeoOverview {
  siteProblems: SeoSiteProblem[];
  areas: SeoAreaSummary[];
  issues: SeoIssue[];
}

export const seoAreaLabels: Record<SeoArea, string> = {
  Product: 'Товари сайту',
  Category: 'Розділи сайту',
  Article: 'Статті',
  Page: 'Сторінки сайту',
};

export const seoProblemLabels: Record<SeoProblemKind, string> = {
  NoTitle: 'Немає SEO-заголовка',
  NoDescription: 'Немає SEO-опису',
  TitleTooLong: 'Заголовок довший за 60 знаків',
  DescriptionTooLong: 'Опис довший за 160 знаків',
  DuplicateTitle: 'Такий самий заголовок в іншої сторінки',
  NoRussian: 'Немає російських текстів',
};

export const seoSiteProblemLabels: Record<SeoSiteProblem, string> = {
  NoAnalytics: 'Не підключено аналітику (Google Analytics або Tag Manager).',
  NoGoogleVerification: 'Немає коду підтвердження Google Search Console.',
  NoBingVerification: 'Немає коду підтвердження Bing Webmaster Tools.',
  NoSharePicture: 'Немає картинки для поширення в соцмережах.',
};

/** «Немає SEO-опису (рос.)»: the problem with its language, as staff read it. */
export function seoProblemText(problem: SeoProblem): string {
  const label = seoProblemLabels[problem.kind];
  if (problem.language === 'uk') return `${label} (укр.)`;
  if (problem.language === 'ru') return `${label} (рос.)`;
  return label;
}
