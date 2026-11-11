import { describe, expect, it } from 'vitest';

import { articleBodyFromRichText, articleBodyToRichText } from './article-rich-text';

import type { ArticleBlock } from '../../entities/articles/article';

const block = (changes: Partial<ArticleBlock>): ArticleBlock => ({
  kind: 'Paragraph',
  text: null,
  lead: null,
  items: [],
  photoId: null,
  alt: null,
  ...changes,
});

const body = [
  block({ kind: 'Heading', text: 'Тканина' }),
  block({ text: 'Шиємо **самі**.' }),
  block({ kind: 'Image', photoId: 7, alt: 'Костюм у цеху' }),
  block({ kind: 'List', items: ['щільність', 'склад'] }),
  block({ kind: 'Image', photoId: 9 }),
];

describe('article rich text', () => {
  it('keeps text and photos in their order both ways', () => {
    const doc = articleBodyToRichText(body, [
      { id: 7, url: 'https://cdn.test/7.jpg', thumbnailUrl: null, width: null, height: null },
    ]);

    expect(doc.content?.map((node) => node.type)).toEqual([
      'heading',
      'paragraph',
      'photo',
      'bulletList',
      'photo',
    ]);
    expect(doc.content?.[2]?.attrs).toEqual({
      photoId: 7,
      src: 'https://cdn.test/7.jpg',
      alt: 'Костюм у цеху',
    });
    // The library no longer has photo 9: no address, the editor says so.
    expect(doc.content?.[4]?.attrs).toEqual({ photoId: 9, src: null, alt: '' });
    expect(articleBodyFromRichText(doc)).toEqual(body);
  });

  it('drops a photo block without a photo and trims the alt text', () => {
    expect(
      articleBodyFromRichText({
        type: 'doc',
        content: [
          { type: 'photo', attrs: { photoId: null, src: null, alt: 'x' } },
          {
            type: 'photo',
            attrs: { photoId: 3, src: 'https://cdn.test/3.jpg', alt: '  Цех   зранку ' },
          },
          { type: 'paragraph' },
        ],
      }),
    ).toEqual([block({ kind: 'Image', photoId: 3, alt: 'Цех зранку' })]);
  });

  it('opens an empty body as an empty document', () => {
    expect(articleBodyToRichText([], [])).toEqual({
      type: 'doc',
      content: [{ type: 'paragraph' }],
    });
  });
});
