import { describe, expect, it } from 'vitest';

import {
  blocksFromText,
  blocksToText,
  factsFromText,
  factsToText,
  specLinesWithoutValue,
  specsFromText,
  specsToText,
} from './content-text-markup';

describe('content text markup', () => {
  it('reads facts with and without a label', () => {
    const facts = factsFromText('Сезон:  весна, літо\n\nДля роботи надворі\nЧас: 8:00');
    expect(facts).toEqual([
      { label: 'Сезон', text: 'весна, літо' },
      { label: null, text: 'Для роботи надворі' },
      { label: 'Час', text: '8:00' },
    ]);
    expect(factsFromText(factsToText(facts))).toEqual(facts);
  });

  it('reads headings, paragraphs with a lead and lists', () => {
    const text = [
      '## Опис',
      '',
      '**Куртка:** пряма,',
      'з кишенями.',
      '',
      '- дві кишені',
      '• світловідбивна стрічка',
      'Останній абзац.',
    ].join('\n');
    const blocks = blocksFromText(text);
    expect(blocks).toEqual([
      { kind: 'Heading', text: 'Опис', lead: null, items: [] },
      { kind: 'Paragraph', text: 'пряма, з кишенями.', lead: 'Куртка:', items: [] },
      { kind: 'List', text: null, lead: null, items: ['дві кишені', 'світловідбивна стрічка'] },
      { kind: 'Paragraph', text: 'Останній абзац.', lead: null, items: [] },
    ]);
    expect(blocksFromText(blocksToText(blocks))).toEqual(blocks);
  });

  it('keeps a paragraph that is only bold as plain text', () => {
    expect(blocksFromText('**Увага**')).toEqual([
      { kind: 'Paragraph', text: 'Увага', lead: null, items: [] },
    ]);
  });

  it('reads characteristic groups and reports lines without a value', () => {
    const text = 'Тип: костюм\n## Куртка\nЗастібка: блискавка\nбез значення\n\n## Порожня';
    const groups = specsFromText(text);
    expect(groups).toEqual([
      { title: null, rows: [{ name: 'Тип', value: 'костюм' }] },
      { title: 'Куртка', rows: [{ name: 'Застібка', value: 'блискавка' }] },
    ]);
    expect(specLinesWithoutValue(text)).toEqual(['без значення']);
    expect(specsFromText(specsToText(groups))).toEqual(groups);
  });
});
