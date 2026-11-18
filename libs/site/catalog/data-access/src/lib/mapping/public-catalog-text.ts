import { invalid, list, optionalText, record, text } from './public-catalog-values';

import type { CatalogSpecGroup, CatalogTextBlock } from '@site/catalog/model';

/** A text block of a category or product; null when it holds nothing to show. */
export function mapBlock(value: unknown): CatalogTextBlock | null {
  const block = record(value, 'text block');
  const kind = text(block['kind'], 'block kind');
  if (kind === 'List') {
    const items = list(block['items'] ?? [], 'list items').map((item) => text(item, 'list item'));
    return items.length > 0 ? { type: 'list', items } : null;
  }
  const body = optionalText(block['text'], 'block text') ?? '';
  if (kind === 'Heading') return body ? { type: 'heading', text: body } : null;
  if (kind !== 'Paragraph') throw invalid('block kind');
  const lead = optionalText(block['lead'], 'block lead');
  if (!body && !lead) return null;
  return lead ? { type: 'paragraph', text: body, lead } : { type: 'paragraph', text: body };
}

/** A short fact «Сезон: весна, літо» is a paragraph with a bold label. */
export function mapFact(value: unknown): CatalogTextBlock {
  const fact = record(value, 'fact');
  const label = optionalText(fact['label'], 'fact label');
  const body = text(fact['text'], 'fact text');
  return label
    ? { type: 'paragraph', text: body, lead: `${label.replace(/:\s*$/, '')}:` }
    : { type: 'paragraph', text: body };
}

export function mapSpecGroup(value: unknown): CatalogSpecGroup {
  const group = record(value, 'spec group');
  return {
    title: optionalText(group['title'], 'spec title'),
    rows: list(group['rows'], 'spec rows').map((item) => {
      const row = record(item, 'spec row');
      return { name: text(row['name'], 'spec name'), value: text(row['value'], 'spec value') };
    }),
  };
}
