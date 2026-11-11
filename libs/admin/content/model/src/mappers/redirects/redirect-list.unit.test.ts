import { describe, expect, it } from 'vitest';

import { filterRedirects, redirectSourceLabel } from './redirect-list';

import type { SiteRedirect } from '../../entities/redirects/site-redirect';

const row = (
  id: number,
  fromPath: string,
  source: SiteRedirect['source'],
  note: string | null = null,
) =>
  ({
    id,
    fromPath,
    toPath: '/uk/catalog/kostyumy',
    source,
    note,
    updatedAtUtc: '',
    updatedBy: '',
  }) satisfies SiteRedirect;

describe('filterRedirects', () => {
  const rows = [
    row(1, '/kostyum-lider', 'OldSite', 'Товар «Костюм Лідер»'),
    row(2, '/a', 'Manual'),
  ];

  it('finds by address or note and narrows by source', () => {
    expect(filterRedirects(rows, 'ЛІДЕР', null).map((x) => x.id)).toEqual([1]);
    expect(filterRedirects(rows, 'kostyumy', null).map((x) => x.id)).toEqual([1, 2]);
    expect(filterRedirects(rows, '', 'Manual').map((x) => x.id)).toEqual([2]);
  });

  it('names the source in Ukrainian', () => {
    expect(redirectSourceLabel('SlugChange')).toBe('Зміна адреси');
  });
});
