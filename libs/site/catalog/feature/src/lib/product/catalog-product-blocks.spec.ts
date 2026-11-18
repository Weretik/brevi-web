import { getCatalogDictionary } from '@site/catalog/ui';
import { describe, expect, it } from 'vitest';

import { productNav, productSpecs } from './catalog-product-blocks';

import type { CatalogProduct } from '@site/catalog/model';

const text = getCatalogDictionary('uk').product;

describe('catalog product blocks', () => {
  it('puts the short facts first as their own group', () => {
    const product = { specs: [{ title: 'Тканина', rows: [] }] } as unknown as CatalogProduct;
    const facts = { rows: [{ name: 'Сезон', value: 'Літо' }], tags: [], notes: [], audience: null };

    const specs = productSpecs(product, facts as never, 'Коротко');

    expect(specs.map((group) => group.title)).toEqual(['Коротко', 'Тканина']);
  });

  it('skips the short facts group when there are none', () => {
    const product = { specs: [] } as unknown as CatalogProduct;

    expect(productSpecs(product, { rows: [] } as never, 'Коротко')).toEqual([]);
  });

  it('links only the blocks the page shows, and always the size chart', () => {
    const nav = productNav(text, {
      specs: true,
      description: false,
      related: false,
      sizesHref: '/uk/sizes',
    });

    expect(nav.map((item) => item.href)).toEqual(['#product-specs', '/uk/sizes']);
  });
});
