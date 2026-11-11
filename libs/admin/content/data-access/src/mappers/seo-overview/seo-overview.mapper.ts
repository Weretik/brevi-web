import { contentLanguages, seoAreas, seoProblemKinds, seoSiteProblems } from '@admin/content/model';

import { integer, list, oneOf, record, text } from '../../validators/content-response';

import type { SeoAreaSummary, SeoIssue, SeoOverview, SeoProblem } from '@admin/content/model';

function mapProblem(value: unknown): SeoProblem {
  const problem = record(value, 'проблема');
  const language = problem['language'];
  return {
    kind: oneOf(problem['kind'], seoProblemKinds, 'вид проблеми'),
    language: language == null ? null : oneOf(language, contentLanguages, 'мова'),
  };
}

function mapIssue(value: unknown): SeoIssue {
  const issue = record(value, 'сторінка з проблемами');
  return {
    area: oneOf(issue['area'], seoAreas, 'розділ'),
    id: text(issue['id'], 'ідентифікатор'),
    name: text(issue['name'], 'назва'),
    path: text(issue['path'], 'адреса'),
    problems: list(issue['problems'], 'проблеми').map(mapProblem),
  };
}

function mapArea(value: unknown): SeoAreaSummary {
  const area = record(value, 'розділ');
  return {
    area: oneOf(area['area'], seoAreas, 'розділ'),
    onSite: integer(area['onSite'], 'на сайті'),
    withProblems: integer(area['withProblems'], 'з проблемами'),
  };
}

export function mapSeoOverview(value: unknown): SeoOverview {
  const overview = record(value, 'SEO-огляд');
  return {
    siteProblems: list(overview['siteProblems'], 'проблеми сайту').map((x) =>
      oneOf(x, seoSiteProblems, 'проблема сайту'),
    ),
    areas: list(overview['areas'], 'розділи').map(mapArea),
    issues: list(overview['issues'], 'сторінки').map(mapIssue),
  };
}
