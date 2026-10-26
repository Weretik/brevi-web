import { describe, expect, it } from 'vitest';

import { emptySewingCompositionDraft } from './sewing-composition-defaults';
import { isSewingCompositionDirty } from './sewing-composition-dirty';
import { emptySewingMaterial } from './sewing-material-defaults';

describe('Editable composition comparison', () => {
  it('keeps model and Article lines as separate draft collections and detects edits', () => {
    const original = emptySewingCompositionDraft(42, 501);
    const edited = {
      ...original,
      articleMaterials: [emptySewingMaterial('Fabric', 'article-fabric', 0)],
    };
    expect(original.modelMaterials).toEqual([]);
    expect(original.articleMaterials).toEqual([]);
    expect(isSewingCompositionDirty(original, original)).toBe(false);
    expect(isSewingCompositionDirty(edited, original)).toBe(true);
  });
});
