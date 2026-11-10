import { describe, expect, it } from 'vitest';

import {
  hasContentProductErrors,
  isValidContentSlug,
  validateContentProduct,
} from './content-product-validation';

import type { ContentProductFormValues } from '../../forms/product-pages/content-product-form';

const empty = {
  name: '',
  seoTitle: '',
  seoDescription: '',
  summary: '',
  description: '',
  specs: '',
};
const values = (changes: Partial<ContentProductFormValues> = {}): ContentProductFormValues => ({
  slug: 'kostyum-lider',
  showOnSite: true,
  uk: empty,
  ru: empty,
  ...changes,
});

describe('content product validation', () => {
  it.each([
    ['kostyum-lider', true],
    ['abc', true],
    ['ab', false],
    ['Kostyum', false],
    ['kostyum--lider', false],
    ['-kostyum', false],
    ['костюм', false],
  ])('checks the address %s', (slug, valid) => {
    expect(isValidContentSlug(slug)).toBe(valid);
  });

  it('accepts an empty page with a valid address', () => {
    expect(hasContentProductErrors(validateContentProduct(values()))).toBe(false);
  });

  it('reports the address and each language separately', () => {
    const errors = validateContentProduct(
      values({
        slug: 'Костюм',
        uk: { ...empty, seoTitle: 'а'.repeat(201), specs: 'рядок без значення' },
        ru: { ...empty, seoDescription: 'а'.repeat(321) },
      }),
    );
    expect(errors.slug).toBeDefined();
    expect(errors.uk?.seoTitle).toBe('Не більше 200 символів.');
    expect(errors.uk?.specs).toContain('рядок без значення');
    expect(errors.ru?.seoDescription).toBe('Не більше 320 символів.');
    expect(errors.ru?.seoTitle).toBeUndefined();
  });
});
