import type { ContentTextBlock } from '../../entities/product-pages/content-product';

/**
 * A text as the visual editor holds it: paragraphs, headings, and bulleted lists whose text may be bold
 * or italic. The shape is the document of the editor (ProseMirror JSON), so no markup is typed by hand.
 */
export interface ContentRichNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: ContentRichNode[];
  text?: string;
  marks?: { type: string }[];
}

export const emptyRichText: ContentRichNode = { type: 'doc', content: [{ type: 'paragraph' }] };

/**
 * Stored texts are plain strings, so bold and italic are kept inside them as `**…**` and `*…*`
 * (a typed asterisk is kept as `\*`). Staff never see these marks: the editor shows the formatting,
 * and the site renders it.
 */
const escape = (text: string) => text.replace(/([\\*])/g, '\\$1');

function inlineToText(nodes: readonly ContentRichNode[] | undefined): string {
  return (nodes ?? [])
    .map((node) => {
      if (node.type === 'hardBreak') return ' ';
      const text = node.text ?? '';
      if (!text.trim()) return text;
      const marks = new Set((node.marks ?? []).map((mark) => mark.type));
      const wrap = `${marks.has('bold') ? '**' : ''}${marks.has('italic') ? '*' : ''}`;
      if (!wrap) return escape(text);
      // Marks hug the words, so «**Куртка:** пряма» keeps its space outside the bold part.
      const [, before = '', body = '', after = ''] = /^(\s*)(.*?)(\s*)$/s.exec(text) ?? [];
      return `${before}${wrap}${escape(body)}${wrap}${after}`;
    })
    .join('');
}

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

type Run = { text: string; bold: boolean; italic: boolean };

/** Splits a stored string into runs of plain, bold, and italic text. */
export function inlineRuns(value: string): Run[] {
  const runs: Run[] = [];
  let bold = false;
  let italic = false;
  let text = '';
  const flush = () => {
    if (text) runs.push({ text, bold, italic });
    text = '';
  };
  for (let at = 0; at < value.length; at += 1) {
    const char = value[at];
    if (char === '\\' && at + 1 < value.length) {
      at += 1;
      text += value[at];
    } else if (char === '*') {
      let count = 1;
      while (value[at + count] === '*' && count < 3) count += 1;
      at += count - 1;
      flush();
      if (count !== 1) bold = !bold;
      if (count !== 2) italic = !italic;
    } else {
      text += char;
    }
  }
  flush();
  return runs;
}

/** A stored string without its formatting marks. */
export const plainInline = (value: string) =>
  inlineRuns(value)
    .map((run) => run.text)
    .join('');

function textToInline(value: string): ContentRichNode[] {
  return inlineRuns(value).map((run) => {
    const marks = [
      ...(run.bold ? [{ type: 'bold' }] : []),
      ...(run.italic ? [{ type: 'italic' }] : []),
    ];
    return marks.length > 0
      ? { type: 'text', text: run.text, marks }
      : { type: 'text', text: run.text };
  });
}

const paragraph = (value: string): ContentRichNode => {
  const content = textToInline(value);
  return content.length > 0 ? { type: 'paragraph', content } : { type: 'paragraph' };
};

/** Stored blocks as an editor document; the bold lead of a paragraph becomes bold text. */
export function blocksToRichText(blocks: readonly ContentTextBlock[]): ContentRichNode {
  const content = blocks.map((block): ContentRichNode => {
    if (block.kind === 'Heading') {
      return {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: plainInline(block.text ?? '') }],
      };
    }
    if (block.kind === 'List') {
      return {
        type: 'bulletList',
        content: block.items.map((item) => ({ type: 'listItem', content: [paragraph(item)] })),
      };
    }
    const lead = block.lead ? `**${escape(block.lead)}** ` : '';
    return paragraph(`${lead}${block.text ?? ''}`);
  });
  return content.length > 0 ? { type: 'doc', content } : emptyRichText;
}

/** An editor document as stored blocks; empty paragraphs and list lines are dropped. */
export function blocksFromRichText(doc: ContentRichNode): ContentTextBlock[] {
  const blocks: ContentTextBlock[] = [];
  for (const node of doc.content ?? []) {
    if (node.type === 'heading') {
      const text = clean(plainInline(inlineToText(node.content)));
      if (text) blocks.push({ kind: 'Heading', text, lead: null, items: [] });
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = (node.content ?? [])
        .map((item) =>
          clean((item.content ?? []).map((part) => inlineToText(part.content)).join(' ')),
        )
        .filter(Boolean);
      if (items.length > 0) blocks.push({ kind: 'List', text: null, lead: null, items });
    } else {
      const text = clean(inlineToText(node.content));
      if (text) blocks.push({ kind: 'Paragraph', text, lead: null, items: [] });
    }
  }
  return blocks;
}
