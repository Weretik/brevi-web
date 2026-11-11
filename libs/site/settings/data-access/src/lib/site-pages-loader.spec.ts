import { describe, expect, it } from 'vitest';

import { withPageText } from './page-text-metadata';
import { mapSitePageTexts } from './site-pages-loader';

describe('mapSitePageTexts', () => {
  it('keeps the texts by page key', () => {
    expect(
      mapSitePageTexts({
        items: [
          {
            key: 'wholesale',
            uk: { title: 'Спецодяг оптом', description: ' ' },
            ru: { title: null, description: null },
          },
        ],
      }),
    ).toEqual({
      wholesale: {
        uk: { title: 'Спецодяг оптом', description: null },
        ru: { title: null, description: null },
      },
    });
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapSitePageTexts({ items: [{ key: 1 }] })).toThrow();
    expect(() => mapSitePageTexts(null)).toThrow();
  });
});

describe('withPageText', () => {
  const page = {
    title: 'Свій заголовок',
    description: 'Свій опис',
    openGraph: { title: 'Свій заголовок', description: 'Свій опис', url: '/uk/order-in-bulk' },
  };

  it('puts the saved texts over the page own, also in Open Graph', () => {
    expect(withPageText(page, { title: 'Новий', description: null })).toEqual({
      title: 'Новий',
      description: 'Свій опис',
      openGraph: { title: 'Новий', description: 'Свій опис', url: '/uk/order-in-bulk' },
    });
  });

  it('keeps the page as it is without saved texts', () => {
    expect(withPageText(page, undefined)).toBe(page);
    expect(withPageText(page, { title: null, description: null })).toBe(page);
  });
});
