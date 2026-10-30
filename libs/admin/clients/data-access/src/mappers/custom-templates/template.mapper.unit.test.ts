import { describe, expect, it } from 'vitest';

import { templatePayload } from './template-payload';
import { mapTemplateDetail, mapTemplatePage, mapTemplateSelections } from './template.mapper';
import {
  customDetailFixture,
  customId,
  customVersionId,
} from '../../testing/custom-sewing/custom-response.fixture';

const selections = () => ({
  ...customDetailFixture().configuration,
  applications: [{ kind: 'print', location: 'Спина' }],
});
const detail = () => ({
  publicId: customId,
  ownerId: 17,
  revision: 2,
  archived: false,
  kind: 'customConfiguration',
  versionId: customVersionId,
  versionNumber: 2,
  introduction: 'Вступ',
  selections: selections(),
  updatedAt: '2026-10-28T10:00:00Z',
  canEdit: false,
});

describe('template runtime boundary', () => {
  it('maps server ownership and immutable version without restoring costs or private fields', () => {
    const result = mapTemplateDetail(detail());
    expect(result.canEdit).toBe(false);
    expect(result.versionId).toBe(customVersionId);
    expect(result.selections).not.toHaveProperty('internalNote');
    expect(result.selections.applications).toEqual([{ kind: 'print', location: 'Спина' }]);
  });
  it.each([
    { canEdit: 'true' },
    { revision: 0 },
    { kind: 'other' },
    { versionId: 'missing' },
    { introduction: 'x'.repeat(4001) },
  ])('rejects malformed template %j', (change) =>
    expect(() => mapTemplateDetail({ ...detail(), ...change })).toThrow(),
  );
  it('rejects invalid template norms', () =>
    expect(() =>
      mapTemplateSelections({
        ...selections(),
        fabrics: [{ referenceId: 1, quantity: 0, unit: 'Metre' }],
      }),
    ).toThrow());
  it('maps paged summaries and rejects invalid archive flags', () => {
    const summary = { ...detail(), name: 'Куртка', productType: 'Куртка', season: 'winter' };
    const page = { value: [summary], pagedInfo: { pageNumber: 2, totalPages: 3 } };
    expect(mapTemplatePage(page)).toMatchObject({
      page: 2,
      totalPages: 3,
      rows: [{ id: customId }],
    });
    expect(() => mapTemplatePage({ ...page, value: [{ ...summary, archived: 'yes' }] })).toThrow();
  });
  it('whitelists selection payload even when incidental forbidden fields arrive at runtime', () => {
    const result = templatePayload({
      ...selections(),
      internalNote: 'private',
      retail: 999,
    } as ReturnType<typeof mapTemplateSelections>);
    expect(result).not.toHaveProperty('internalNote');
    expect(result).not.toHaveProperty('retail');
    expect(result).not.toHaveProperty('delivery');
    expect(result.applications).toEqual([{ kind: 'print', location: 'Спина' }]);
  });
});
