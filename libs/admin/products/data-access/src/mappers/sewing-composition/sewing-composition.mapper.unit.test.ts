import { describe, expect, it } from 'vitest';

import { mapSewingComposition } from './sewing-composition.mapper';
import {
  compositionResponseFixture as composition,
  sharedMaterial,
} from '../../test-fixtures/sewing-composition/composition-response.fixture';

describe('Sewing composition response mapping', () => {
  it('keeps shared materials, selected fabric and operation quantities distinct', () => {
    const result = mapSewingComposition(composition);
    expect(result.materials.map((m) => [m.scope, m.referenceId])).toEqual([
      ['Model', 10],
      ['Article', 59],
    ]);
    expect(result.operations[0]?.quantity).toBe(2);
  });
  it('rejects an effective line from a different Article and incomplete review metadata', () => {
    expect(() => mapSewingComposition({ ...composition, articleId: 247 })).toThrow();
    expect(() =>
      mapSewingComposition({
        ...composition,
        materials: [{ ...sharedMaterial, reviewedAt: null }],
      }),
    ).toThrow();
    expect(() =>
      mapSewingComposition({
        ...composition,
        operations: [{ ...composition.operations[0], quantity: 0 }],
      }),
    ).toThrow();
  });
  it('rejects an unsafe edit version', () => {
    expect(() =>
      mapSewingComposition({ ...composition, version: Number.MAX_SAFE_INTEGER + 1 }),
    ).toThrow();
  });
});
