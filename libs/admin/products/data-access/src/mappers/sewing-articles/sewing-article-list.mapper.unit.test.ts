import { describe, expect, it } from 'vitest';

import { mapSewingArticles } from './sewing-article-list.mapper';

describe('Sewing Article list response mapping', () => {
  it('rejects mismatched Article parents', () => {
    expect(() =>
      mapSewingArticles({
        productId: 101,
        modelCode: null,
        version: 0,
        articles: [{ id: 1, productId: 102, saleSku: '246', active: true, sortOrder: 0 }],
      }),
    ).toThrow();
  });
});
