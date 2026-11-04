import { quoteTemplateMarks } from '../models/quote-settings-draft';

import type { QuoteTemplateMark } from '../models/quote-settings-draft';

/** A piece of a template: plain text, a known mark filled with its value, or a mark the server does not know. */
export type QuoteTemplatePart =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'mark'; readonly mark: QuoteTemplateMark; readonly text: string }
  | { readonly kind: 'unknown'; readonly text: string };

const markPattern = /\{[^{}\s]*\}/g;

const isKnown = (mark: string): mark is QuoteTemplateMark =>
  (quoteTemplateMarks as readonly string[]).includes(mark);

/** Marks such as `{managerNmae}` that would reach the client as they are. */
export function unknownQuoteMarks(text: string): string[] {
  return [...new Set(text.match(markPattern) ?? [])].filter((mark) => !isKnown(mark));
}

/** Splits a template for the preview, filling each known mark with its example value. */
export function fillQuoteMarks(
  text: string,
  values: Readonly<Record<QuoteTemplateMark, string>>,
): QuoteTemplatePart[] {
  const parts: QuoteTemplatePart[] = [];
  let last = 0;
  for (const match of text.matchAll(markPattern)) {
    const at = match.index ?? 0;
    if (at > last) parts.push({ kind: 'text', text: text.slice(last, at) });
    const mark = match[0];
    parts.push(
      isKnown(mark) ? { kind: 'mark', mark, text: values[mark] } : { kind: 'unknown', text: mark },
    );
    last = at + mark.length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}
