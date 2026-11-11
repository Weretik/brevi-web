import type { SitePageText } from './site-pages-loader';
import type { Metadata } from 'next';

/**
 * Page metadata with the title and description staff saved in «Сторінки сайту». An empty text keeps the page's
 * own; Open Graph gets the same texts so link previews match the search result.
 */
export function withPageText(
  metadata: Metadata,
  text: Pick<SitePageText, 'title' | 'description'> | undefined,
): Metadata {
  if (!text || (!text.title && !text.description)) return metadata;
  const title = text.title ?? metadata.title;
  const description = text.description ?? metadata.description;
  return {
    ...metadata,
    title,
    description,
    ...(metadata.openGraph
      ? {
          openGraph: {
            ...metadata.openGraph,
            ...(text.title ? { title: text.title } : {}),
            ...(text.description ? { description: text.description } : {}),
          },
        }
      : {}),
  };
}
