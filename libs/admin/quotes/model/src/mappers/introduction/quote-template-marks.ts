import { quoteTemplateMarks } from '../../forms/settings/quote-settings-draft';

import type { QuoteMark } from '../../forms/settings/quote-settings-draft';

/** A piece of a template: plain text, a known mark filled with its value, or a mark the server does not know. */
export type QuoteTemplatePart =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'mark'; readonly mark: QuoteMark; readonly text: string }
  | { readonly kind: 'unknown'; readonly text: string };

const markPattern = /\{[^{}\s]*\}/g;

/** Marks such as `{managerNmae}` that would reach the client as they are; `allowed` are the field's marks. */
export function unknownQuoteMarks(
  text: string,
  allowed: readonly QuoteMark[] = quoteTemplateMarks,
): string[] {
  return [...new Set(text.match(markPattern) ?? [])].filter(
    (mark) => !(allowed as readonly string[]).includes(mark),
  );
}

/** Splits a template for the preview, filling each known mark with its example value. */
export function fillQuoteMarks(
  text: string,
  values: Readonly<Partial<Record<QuoteMark, string>>>,
): QuoteTemplatePart[] {
  const isKnown = (mark: string): mark is QuoteMark => Object.hasOwn(values, mark);
  const parts: QuoteTemplatePart[] = [];
  let last = 0;
  for (const match of text.matchAll(markPattern)) {
    const at = match.index ?? 0;
    if (at > last) parts.push({ kind: 'text', text: text.slice(last, at) });
    const mark = match[0];
    parts.push(
      isKnown(mark)
        ? { kind: 'mark', mark, text: values[mark] ?? '' }
        : { kind: 'unknown', text: mark },
    );
    last = at + mark.length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}
