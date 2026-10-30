import { describe, expect, it } from 'vitest';

import { mapCustomBasis } from './custom-basis.mapper';
import { customConfigurationPayload } from './custom-configuration.mapper';
import { mapCustomDetail } from './custom-detail.mapper';
import {
  customBasisFixture,
  customDetailFixture,
  customId,
  customVersionId,
} from '../../testing/custom-sewing/custom-response.fixture';
import { mapQuoteBasis } from '../quotes/quote-price.mapper';

describe('private custom sewing runtime boundary', () => {
  it('reads and posts repeated saved rows without merging their individual norms', () => {
    const dto = customDetailFixture();
    const fabrics = [
      { referenceId: 1, quantity: 1, unit: 'Metre' },
      { referenceId: 1, quantity: 2, unit: 'Metre' },
    ];
    const operations = [
      { referenceId: 2, quantity: 1, manualMinutes: null },
      { referenceId: 2, quantity: 2, manualMinutes: 3 },
    ];
    const model = mapCustomDetail({
      ...dto,
      configuration: { ...dto.configuration, fabrics, operations },
    });
    expect(customConfigurationPayload(model.configuration).fabrics).toEqual(fabrics);
    expect(customConfigurationPayload(model.configuration).operations).toEqual(operations);
  });

  it('posts only configuration intent and strips incidental browser totals', () => {
    const source = { ...customDetailFixture().configuration, retail: 999, basisToken: customId };
    const payload = customConfigurationPayload({
      ...source,
      operations: source.operations.map((row) => ({
        ...row,
        manualMinutes: row.manualMinutes ?? null,
      })),
      applications: source.applications.map((row) => ({
        ...row,
        artworkFileId: row.artworkFileId ?? null,
      })),
    });
    expect(payload).not.toHaveProperty('retail');
    expect(payload).not.toHaveProperty('basisToken');
  });
  it.each([null, 0, -1])(
    'rejects calculated flag with invalid internal cost %s',
    (internalCost) => {
      expect(() => mapCustomBasis(customBasisFixture({ internalCost }))).toThrow();
    },
  );
  it('validates timestamps and accepts expired historical prices without recalculating', () => {
    expect(() => mapCustomBasis(customBasisFixture({ expiresAt: 'bad-date' }))).toThrow();
    expect(() => mapCustomBasis(customBasisFixture({ expiresAt: '2020-01-01' }))).toThrow();
    expect(
      mapCustomBasis(customBasisFixture({ calculatedAt: '2020-01-01', expiresAt: '2020-01-02' }))
        .retail,
    ).toBe(120);
  });
  it('rejects malformed composition and blocks unknown formula', () => {
    const dto = customDetailFixture();
    expect(() =>
      mapCustomDetail({
        ...dto,
        configuration: {
          ...dto.configuration,
          fabrics: [{ referenceId: 1, quantity: 0, unit: 'Metre' }],
        },
      }),
    ).toThrow();
    expect(() =>
      mapCustomBasis({ ...customBasisFixture(), formulaVersion: 'browser-engine' }),
    ).toThrow();
  });
  it('keeps quote V1 pinned when current custom draft receives V2', () => {
    const configuration = customDetailFixture().configuration;
    const raw = {
      basisToken: customId,
      expiresAt: '2030-01-01',
      intent: { kind: 'customSewing', customVersionPublicId: customVersionId },
      source: null,
      retail: 120,
      wholesale: 100,
      largeWholesale: 80,
      currency: 'UAH',
      taxBasis: 'custom_no_extra_vat',
      blockers: [],
      customVersion: {
        draftPublicId: customId,
        versionPublicId: customVersionId,
        number: 1,
        configuration,
        basis: customBasisFixture(),
      },
    };
    const saved = mapQuoteBasis(raw);
    const version2 = {
      publicId: '33333333-3333-4333-8333-333333333333',
      number: 2,
      parentVersionId: customVersionId,
      configuration: { ...configuration, name: 'Тканина B' },
      basis: customBasisFixture({ retail: 150 }),
      actorId: 17,
      createdAt: '2026-10-28T11:00:00Z',
    };
    expect(
      mapCustomDetail(customDetailFixture({ currentVersion: version2 })).currentVersion?.number,
    ).toBe(2);
    expect(saved.selection).toEqual({
      kind: 'customSewing',
      versionId: customVersionId,
      draftId: customId,
    });
    expect(mapQuoteBasis(raw).retail).toBe(saved.retail);
    expect(() => mapQuoteBasis({ ...raw, retail: 150 })).toThrow();
  });
});
