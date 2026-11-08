import { describe, expect, it } from 'vitest';

import { mapAccessRights, toSaveRoleAccessBody } from './access-rights.mapper';

const response = {
  areas: [{ key: 'products', group: 'Довідники', title: 'Товари', actions: ['view', 'edit'] }],
  roles: [
    {
      name: 'Manager',
      title: 'Менеджер',
      locked: false,
      builtIn: true,
      userCount: 2,
      version: 3,
      updatedByName: null,
      updatedAt: null,
      grants: { products: ['view'] },
    },
  ],
};

describe('mapAccessRights', () => {
  it('maps pages and roles', () => {
    const rights = mapAccessRights(response);
    expect(rights.areas[0]).toEqual(response.areas[0]);
    expect(rights.roles[0]).toMatchObject({
      name: 'Manager',
      version: 3,
      grants: { products: ['view'] },
    });
  });

  it('rejects an unknown action', () => {
    expect(() =>
      mapAccessRights({ ...response, areas: [{ ...response.areas[0], actions: ['print'] }] }),
    ).toThrow();
  });

  it('rejects a response without roles', () => {
    expect(() => mapAccessRights({ areas: [] })).toThrow();
  });
});

describe('toSaveRoleAccessBody', () => {
  it('sends the version and the grants', () => {
    expect(toSaveRoleAccessBody(4, { products: ['view', 'edit'] })).toEqual({
      version: 4,
      grants: { products: ['view', 'edit'] },
    });
  });
});
