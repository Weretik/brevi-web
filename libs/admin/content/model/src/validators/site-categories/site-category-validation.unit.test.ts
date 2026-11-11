import { describe, expect, it } from 'vitest';

import { validateSiteCategory } from './site-category-validation';
import {
  newSiteCategoryForm,
  siteCategoryInputOf,
} from '../../forms/site-categories/site-category-form';

describe('site category form', () => {
  it('needs the Ukrainian name and lets a new category have no address', () => {
    const values = newSiteCategoryForm(null);
    expect(validateSiteCategory(values, true)).toEqual({
      uk: { name: 'Вкажіть назву українською.' },
    });
    expect(validateSiteCategory(values, false).slug).toBeDefined();

    const named = { ...values, uk: { ...values.uk, name: ' Спецодяг ' } };
    expect(validateSiteCategory(named, true)).toEqual({});
    expect(validateSiteCategory({ ...named, slug: 'Не адреса' }, true).slug).toBeDefined();
    expect(
      validateSiteCategory({ ...named, ru: { ...named.ru, seoTitle: 'a'.repeat(201) } }, true).ru,
    ).toEqual({ seoTitle: 'Не більше 200 символів.' });
  });

  it('builds the body of a new subcategory', () => {
    const values = newSiteCategoryForm(7);
    const input = siteCategoryInputOf(null, {
      ...values,
      uk: {
        ...values.uk,
        name: ' Куртки ',
        text: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Теплі.' }] }],
        },
      },
    });
    expect(input).toMatchObject({
      id: null,
      revision: 0,
      parentId: 7,
      slug: null,
      showOnSite: false,
    });
    expect(input.uk.name).toBe('Куртки');
    expect(input.uk.text).toEqual([{ kind: 'Paragraph', text: 'Теплі.', lead: null, items: [] }]);
    expect(input.ru).toEqual({ name: null, seoTitle: null, seoDescription: null, text: [] });
  });
});
