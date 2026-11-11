import { describe, expect, it } from 'vitest';

import { mapSeoOverview } from './seo-overview.mapper';

describe('mapSeoOverview', () => {
  it('maps site problems, area counts and pages with problems', () => {
    const overview = mapSeoOverview({
      siteProblems: ['NoAnalytics'],
      areas: [{ area: 'Product', onSite: 12, withProblems: 3 }],
      issues: [
        {
          area: 'Page',
          id: 'contacts',
          name: 'Контакти',
          path: '/contacts',
          problems: [
            { kind: 'TitleTooLong', language: 'uk' },
            { kind: 'NoRussian', language: null },
          ],
        },
      ],
    });
    expect(overview).toEqual({
      siteProblems: ['NoAnalytics'],
      areas: [{ area: 'Product', onSite: 12, withProblems: 3 }],
      issues: [
        {
          area: 'Page',
          id: 'contacts',
          name: 'Контакти',
          path: '/contacts',
          problems: [
            { kind: 'TitleTooLong', language: 'uk' },
            { kind: 'NoRussian', language: null },
          ],
        },
      ],
    });
  });

  it('refuses an unknown problem', () => {
    expect(() =>
      mapSeoOverview({
        siteProblems: [],
        areas: [],
        issues: [{ area: 'Page', id: 'x', name: 'x', path: '/', problems: [{ kind: 'Other' }] }],
      }),
    ).toThrow();
  });
});
