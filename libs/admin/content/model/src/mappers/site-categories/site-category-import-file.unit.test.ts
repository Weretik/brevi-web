import { describe, expect, it } from 'vitest';

import { readSiteCategoryImportFile } from './site-category-import-file';

describe('readSiteCategoryImportFile', () => {
  it('takes the list or an object with items', () => {
    const items = [{ slug: 'specodyag', parentSlug: null }];
    expect(readSiteCategoryImportFile(JSON.stringify(items))).toEqual({ ok: true, items });
    expect(readSiteCategoryImportFile(JSON.stringify({ items }))).toEqual({ ok: true, items });
  });

  it('refuses another file before any request', () => {
    expect(readSiteCategoryImportFile('not json').ok).toBe(false);
    expect(readSiteCategoryImportFile('{"items":[]}').ok).toBe(false);
    // The product transfer file has links, not category addresses.
    expect(readSiteCategoryImportFile('[{"url":"https://brevi.com.ua/x"}]')).toMatchObject({
      ok: false,
      message: expect.stringContaining('перенесення товарів'),
    });
    const many = Array.from({ length: 301 }, (_, index) => ({ slug: `s-${index}` }));
    expect(readSiteCategoryImportFile(JSON.stringify(many)).ok).toBe(false);
  });
});
