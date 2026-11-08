import { describe, expect, it } from 'vitest';

import {
  areAccessGrantsEqual,
  describeGroupAccess,
  groupAccessAreas,
  normalizeAccessGrants,
  setAccessAction,
  setAccessView,
} from './access-grants';

import type { AccessArea } from '../entities/access-rights';

const areas: AccessArea[] = [
  {
    key: 'products',
    group: 'Довідники',
    title: 'Товари',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  { key: 'reports', group: 'Звіти', title: 'Звіт', actions: ['view'] },
  { key: 'fabrics', group: 'Довідники', title: 'Тканини', actions: ['view', 'edit'] },
];

describe('access grants', () => {
  it('turns view on with only view and off with every action removed', () => {
    const on = setAccessView({}, 'products', true);
    expect(on).toEqual({ products: ['view'] });
    const withEdit = setAccessAction(on, 'products', 'edit', true);
    expect(setAccessView(withEdit, 'products', false)).toEqual({});
  });

  it('ignores an action while the page is not visible', () => {
    expect(setAccessAction({}, 'products', 'create', true)).toEqual({});
  });

  it('keeps actions in display order', () => {
    let grants = setAccessView({}, 'products', true);
    grants = setAccessAction(grants, 'products', 'delete', true);
    grants = setAccessAction(grants, 'products', 'create', true);
    expect(grants['products']).toEqual(['view', 'create', 'delete']);
    expect(setAccessAction(grants, 'products', 'create', false)['products']).toEqual([
      'view',
      'delete',
    ]);
  });

  it('normalizes unknown pages, unknown actions and pages without view', () => {
    expect(
      normalizeAccessGrants(
        {
          products: ['edit', 'view'],
          fabrics: ['delete', 'view'],
          reports: ['edit'],
          old: ['view'],
        },
        areas,
      ),
    ).toEqual({ products: ['view', 'edit'], fabrics: ['view'] });
  });

  it('compares grants regardless of order', () => {
    expect(
      areAccessGrantsEqual({ products: ['edit', 'view'] }, { products: ['view', 'edit'] }, areas),
    ).toBe(true);
    expect(areAccessGrantsEqual({ products: ['view'] }, {}, areas)).toBe(false);
    expect(
      areAccessGrantsEqual({ products: ['view'] }, { products: ['view', 'edit'] }, areas),
    ).toBe(false);
  });

  it('groups pages in menu order and counts visible pages', () => {
    const groups = groupAccessAreas(areas);
    expect(groups.map((group) => [group.title, group.areas.map((area) => area.key)])).toEqual([
      ['Довідники', ['products', 'fabrics']],
      ['Звіти', ['reports']],
    ]);
    expect(describeGroupAccess(groups[0], { products: ['view'] })).toBe('1 з 2 сторінок');
    expect(describeGroupAccess(groups[1], { reports: ['view'] })).toBe('1 з 1 сторінки');
    expect(describeGroupAccess(groups[1], {})).toBe('немає доступу');
  });
});
