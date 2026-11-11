import { describe, expect, it } from 'vitest';

import {
  blocksFromRichText,
  blocksToRichText,
  emptyRichText,
  inlineRuns,
  plainInline,
} from './content-rich-text';

import type { ContentTextBlock } from '../../entities/product-pages/content-product';

const block = (changes: Partial<ContentTextBlock>): ContentTextBlock => ({
  kind: 'Paragraph',
  text: null,
  lead: null,
  items: [],
  ...changes,
});

describe('content rich text', () => {
  it('opens stored blocks in the editor: heading, bold lead, list', () => {
    const doc = blocksToRichText([
      block({ kind: 'Heading', text: 'Опис' }),
      block({ text: 'пряма, з кишенями.', lead: 'Куртка:' }),
      block({ kind: 'List', items: ['кишені', '*світловідбивач*'] }),
    ]);

    expect(doc.content?.map((node) => node.type)).toEqual(['heading', 'paragraph', 'bulletList']);
    expect(doc.content?.[1]?.content).toEqual([
      { type: 'text', text: 'Куртка:', marks: [{ type: 'bold' }] },
      { type: 'text', text: ' пряма, з кишенями.' },
    ]);
    expect(doc.content?.[2]?.content?.[1]?.content?.[0]?.content).toEqual([
      { type: 'text', text: 'світловідбивач', marks: [{ type: 'italic' }] },
    ]);
  });

  it('saves the editor document as blocks with bold and italic kept inside the text', () => {
    const blocks = blocksFromRichText({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: ' Опис ' }] },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Куртка: ', marks: [{ type: 'bold' }] },
            { type: 'text', text: 'пряма, 5*5 ' },
            { type: 'text', text: 'тепла', marks: [{ type: 'bold' }, { type: 'italic' }] },
          ],
        },
        { type: 'paragraph' },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'кишені' }] }],
            },
            { type: 'listItem', content: [{ type: 'paragraph' }] },
          ],
        },
      ],
    });

    expect(blocks).toEqual([
      block({ kind: 'Heading', text: 'Опис' }),
      block({ text: '**Куртка:** пряма, 5\\*5 ***тепла***' }),
      block({ kind: 'List', items: ['кишені'] }),
    ]);
  });

  it('keeps a text unchanged through the editor', () => {
    const blocks = [
      block({ kind: 'Heading', text: 'Тканина' }),
      block({ text: '**Грета:** бавовна *35 %*, щільність 5\\*5.' }),
      block({ kind: 'List', items: ['перша', '**друга**'] }),
    ];

    expect(blocksFromRichText(blocksToRichText(blocks))).toEqual(blocks);
    expect(blocksFromRichText(emptyRichText)).toEqual([]);
    expect(blocksToRichText([])).toEqual(emptyRichText);
  });

  it('reads formatting marks and strips them for plain text', () => {
    expect(inlineRuns('a **b** *c* \\*d')).toEqual([
      { text: 'a ', bold: false, italic: false },
      { text: 'b', bold: true, italic: false },
      { text: ' ', bold: false, italic: false },
      { text: 'c', bold: false, italic: true },
      { text: ' *d', bold: false, italic: false },
    ]);
    expect(plainInline('**Куртка:** пряма')).toBe('Куртка: пряма');
  });
});
