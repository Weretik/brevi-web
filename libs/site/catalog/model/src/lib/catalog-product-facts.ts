import { plainCatalogText } from './catalog-inline';

import type { CatalogTextBlock } from './catalog-category';

/** Short facts of a product sorted for the page: labels near the name, rows for the table, other lines. */
export type CatalogProductFacts = {
  /** Short lines without a label, such as «Чоловіча»; shown as tags next to the name. */
  tags: readonly string[];
  /** «Сезон» → «зима, весна»; shown as the first table of the characteristics. */
  rows: readonly { name: string; value: string }[];
  /** Who the model is for («Підходить для професій» and its value); shown under the name. */
  audience: { name: string; value: string } | null;
  /** Longer lines without a label, such as «Можливо зробити з тканини іншого кольору». */
  notes: readonly string[];
};

/** A label typed into the text itself: «Сезон : зима» or «Тканина: Грета». */
const TYPED_LABEL = /^([^:.]{2,48}?)\s*:\s*(.+)$/s;
const AUDIENCE = /^(підходить|подходит)/i;
const TAG_LENGTH = 40;

/**
 * Sorts the short facts staff wrote for a product. Staff write them either with a bold label or as
 * «Назва : значення» in one line; both become table rows. A short line without a label becomes a tag,
 * a longer one stays a note.
 */
export function splitCatalogProductFacts(
  summary: readonly CatalogTextBlock[],
): CatalogProductFacts {
  const tags: string[] = [];
  const rows: { name: string; value: string }[] = [];
  const notes: string[] = [];
  for (const block of summary) {
    if (block.type === 'heading') continue;
    const lines =
      block.type === 'list'
        ? block.items.map((item) => ({ lead: undefined, text: item }))
        : [{ lead: block.lead, text: block.text }];
    for (const line of lines) {
      const text = plainCatalogText(line.text).trim();
      const lead = line.lead
        ? plainCatalogText(line.lead)
            .replace(/\s*:\s*$/, '')
            .trim()
        : '';
      if (lead) {
        if (text) rows.push({ name: lead, value: text });
        continue;
      }
      const typed = TYPED_LABEL.exec(text);
      if (typed) {
        rows.push({ name: typed[1].trim(), value: typed[2].trim() });
      } else if (text.length > 0 && text.length <= TAG_LENGTH && !text.endsWith('.')) {
        tags.push(text);
      } else if (text) {
        notes.push(text);
      }
    }
  }
  const audience = rows.find((row) => AUDIENCE.test(row.name)) ?? null;
  return { tags, rows, audience, notes };
}
