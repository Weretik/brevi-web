import { parseCatalogInline } from '@site/catalog/model';

/**
 * A text of the Admin with its bold and italic parts as `<strong>` and `<em>`. Articles keep formatting
 * the same way as catalog texts (`**…**`, `*…*`), so they share the catalog parser.
 */
export function ArticleInline({ text }: { text: string }) {
  return parseCatalogInline(text).map((run, index) => {
    const body = run.italic ? <em>{run.text}</em> : run.text;
    return run.bold ? <strong key={index}>{body}</strong> : <span key={index}>{body}</span>;
  });
}
