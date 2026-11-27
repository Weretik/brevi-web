import { describe, expect, it } from 'vitest';

import {
  accessCellOf,
  changedAccessAreas,
  describePageCount,
  describeRoleAccess,
  filterAccessAreas,
} from './access-overview';

import type { AccessArea, AccessRole } from '../entities/access-rights';

const area = (key: string, title: string, group: string): AccessArea => ({
  key,
  group,
  title,
  actions: ['view', 'create', 'edit', 'delete'],
  actionLabels: {},
});

const quotes = area('quotes', 'Комерційні пропозиції', 'Менеджер сервісу');
const stock = area('fabric-stock', 'Залишки', 'Склад тканин');
const areas = [quotes, stock];

const role = (patch: Partial<AccessRole>): AccessRole => ({
  name: 'Manager',
  title: 'Менеджер',
  locked: false,
  builtIn: true,
  userCount: 0,
  userNames: [],
  version: 1,
  updatedByName: null,
  updatedAt: null,
  grants: {},
  ...patch,
});

describe('access overview (ACC-002)', () => {
  it('counts pages in Ukrainian', () => {
    expect(describePageCount(1)).toBe('1 сторінка');
    expect(describePageCount(3)).toBe('3 сторінки');
    expect(describePageCount(12)).toBe('12 сторінок');
    expect(describePageCount(21)).toBe('21 сторінка');
  });

  it('lists only the pages whose rights changed', () => {
    const changed = changedAccessAreas({ quotes: ['view', 'edit'] }, { quotes: ['view'] }, areas);
    expect(changed.map((item) => item.key)).toEqual(['quotes']);
    expect(
      changedAccessAreas({ quotes: ['edit', 'view'] }, { quotes: ['view', 'edit'] }, areas),
    ).toEqual([]);
  });

  it('finds pages by every word of the title or group and by filter', () => {
    const base = { filter: 'all' as const, grants: {}, changed: new Set<string>() };
    expect(filterAccessAreas(areas, { ...base, search: 'склад' })).toEqual([stock]);
    expect(filterAccessAreas(areas, { ...base, search: 'КОМЕРЦІЙНІ сервісу' })).toEqual([quotes]);
    expect(
      filterAccessAreas(areas, {
        ...base,
        search: '',
        filter: 'granted',
        grants: { quotes: ['view'] },
      }),
    ).toEqual([quotes]);
    expect(
      filterAccessAreas(areas, {
        ...base,
        search: '',
        filter: 'changed',
        changed: new Set(['fabric-stock']),
      }),
    ).toEqual([stock]);
  });

  it('describes a role in the role list', () => {
    expect(describeRoleAccess(role({ locked: true }), {}, areas)).toBe('усе, не змінюється');
    expect(describeRoleAccess(role({}), { quotes: ['view'] }, areas)).toBe('1 сторінка');
    expect(describeRoleAccess(role({ builtIn: false }), {}, areas)).toBe(
      'власна роль · 0 сторінок',
    );
  });

  it('shows a compare cell as letters of the held actions', () => {
    expect(accessCellOf(role({ grants: { quotes: ['view', 'create', 'edit'] } }), quotes)).toBe(
      'П С Р',
    );
    expect(accessCellOf(role({}), quotes)).toBe('—');
    expect(accessCellOf(role({ locked: true }), quotes)).toBe('усе');
  });
});
