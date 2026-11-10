import type {
  ContentProductFact,
  ContentSpecGroup,
  ContentTextBlock,
} from '../../entities/product-pages/content-product';

/**
 * Staff type the texts of a product page as plain text with three marks:
 * `## ` starts a heading (or a group of characteristics), `- ` a list line, and `**…**` at the start
 * of a paragraph is its bold lead. «Назва: значення» is a fact or a characteristic.
 */

const lines = (value: string) => value.replace(/\r\n?/g, '\n').split('\n');
const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

function pair(line: string): [string, string] | null {
  const at = line.indexOf(':');
  if (at <= 0) return null;
  const name = clean(line.slice(0, at));
  const value = clean(line.slice(at + 1));
  return name && value ? [name, value] : null;
}

export function factsToText(facts: readonly ContentProductFact[]): string {
  return facts.map((fact) => (fact.label ? `${fact.label}: ${fact.text}` : fact.text)).join('\n');
}

/** One fact per line; a line without «:» is a fact without a label. */
export function factsFromText(value: string): ContentProductFact[] {
  return lines(value).flatMap((line) => {
    const text = clean(line);
    if (!text) return [];
    const found = pair(text);
    return [found ? { label: found[0], text: found[1] } : { label: null, text }];
  });
}

export function blocksToText(blocks: readonly ContentTextBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'Heading') return `## ${block.text ?? ''}`;
      if (block.kind === 'List') return block.items.map((item) => `- ${item}`).join('\n');
      return block.lead ? `**${block.lead}** ${block.text ?? ''}` : (block.text ?? '');
    })
    .join('\n\n');
}

/** Paragraphs are split by an empty line; lines of one paragraph are joined. */
export function blocksFromText(value: string): ContentTextBlock[] {
  const blocks: ContentTextBlock[] = [];
  let paragraph: string[] = [];
  let items: string[] = [];
  const closeParagraph = () => {
    const text = clean(paragraph.join(' '));
    paragraph = [];
    if (!text) return;
    const lead = /^\*\*(.+?)\*\*\s*(.*)$/.exec(text);
    if (lead && lead[2]) {
      blocks.push({ kind: 'Paragraph', text: lead[2], lead: clean(lead[1] ?? ''), items: [] });
    } else {
      blocks.push({ kind: 'Paragraph', text: text.replace(/\*\*/g, ''), lead: null, items: [] });
    }
  };
  const closeList = () => {
    if (items.length > 0) blocks.push({ kind: 'List', text: null, lead: null, items });
    items = [];
  };
  for (const raw of lines(value)) {
    const line = raw.trim();
    if (!line) {
      closeParagraph();
      closeList();
    } else if (line.startsWith('## ')) {
      closeParagraph();
      closeList();
      const text = clean(line.slice(3));
      if (text) blocks.push({ kind: 'Heading', text, lead: null, items: [] });
    } else if (/^[-•–]\s+/.test(line)) {
      closeParagraph();
      const item = clean(line.replace(/^[-•–]\s+/, ''));
      if (item) items.push(item);
    } else {
      closeList();
      paragraph.push(line);
    }
  }
  closeParagraph();
  closeList();
  return blocks;
}

export function specsToText(groups: readonly ContentSpecGroup[]): string {
  return groups
    .map((group) =>
      [
        ...(group.title ? [`## ${group.title}`] : []),
        ...group.rows.map((row) => `${row.name}: ${row.value}`),
      ].join('\n'),
    )
    .join('\n\n');
}

/** `## Куртка` starts a group; «Назва: значення» lines fill it. Lines without «:» are skipped. */
export function specsFromText(value: string): ContentSpecGroup[] {
  const groups: ContentSpecGroup[] = [];
  let current: ContentSpecGroup | null = null;
  for (const raw of lines(value)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('## ')) {
      current = { title: clean(line.slice(3)) || null, rows: [] };
      groups.push(current);
      continue;
    }
    const found = pair(line);
    if (!found) continue;
    if (!current) {
      current = { title: null, rows: [] };
      groups.push(current);
    }
    current.rows.push({ name: found[0], value: found[1] });
  }
  return groups.filter((group) => group.rows.length > 0);
}

/** Lines of characteristics that have no «:» and would be lost on save. */
export function specLinesWithoutValue(value: string): string[] {
  return lines(value)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('## ') && !pair(line));
}
