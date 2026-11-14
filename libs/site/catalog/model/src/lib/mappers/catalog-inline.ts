/** A run of text of one formatting inside a paragraph, a heading, or a list line. */
export type CatalogInlineRun = { text: string; bold: boolean; italic: boolean };

/**
 * Splits a text of the Admin into runs. Staff format texts in the visual editor of the Admin; the API
 * keeps bold as `**…**`, italic as `*…*`, and a typed asterisk as `\*` inside the plain string.
 */
export function parseCatalogInline(value: string): CatalogInlineRun[] {
  const runs: CatalogInlineRun[] = [];
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

/** A text of the Admin without its formatting, for search snippets and structured data. */
export function plainCatalogText(value: string): string {
  return parseCatalogInline(value)
    .map((run) => run.text)
    .join('');
}
