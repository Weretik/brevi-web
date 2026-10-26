import { describe, expect, it } from 'vitest';

import { parsePpeMarkupDraft } from './parse-ppe-markup-draft';

describe('PPE markup draft validation', () => {
  it('keeps omitted fractions distinct from an explicitly entered zero', () => {
    expect(parsePpeMarkupDraft({ retail: '', wholesale: '.36', largeWholesale: '.3' })).toBeNull();
    expect(parsePpeMarkupDraft({ retail: '0', wholesale: '.36', largeWholesale: '.3' })).toEqual({
      retail: 0,
      wholesale: 0.36,
      largeWholesale: 0.3,
    });
  });
  it('rejects nonfinite, negative and excessive-precision input', () => {
    for (const retail of ['NaN', 'Infinity', '-0.5', '0.000000001'])
      expect(parsePpeMarkupDraft({ retail, wholesale: '.36', largeWholesale: '.3' })).toBeNull();
  });
});
