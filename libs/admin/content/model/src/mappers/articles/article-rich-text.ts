import {
  blocksFromRichText,
  blocksToRichText,
  emptyRichText,
} from '../product-pages/content-rich-text';

import type { ArticleBlock, ArticlePhoto } from '../../entities/articles/article';
import type { ContentRichNode } from '../product-pages/content-rich-text';

const photoNode = 'photo';

/**
 * An article body as a document of the visual editor. A picture becomes a photo block with the
 * address of the library photo for the preview; a photo the library no longer has gets no address,
 * and the editor says so.
 */
export function articleBodyToRichText(
  blocks: readonly ArticleBlock[],
  photos: readonly ArticlePhoto[],
): ContentRichNode {
  const urls = new Map(photos.map((photo) => [photo.id, photo.url]));
  const content = blocks.flatMap((block): ContentRichNode[] =>
    block.kind === 'Image'
      ? block.photoId === null
        ? []
        : [
            {
              type: photoNode,
              attrs: {
                photoId: block.photoId,
                src: urls.get(block.photoId) ?? null,
                alt: block.alt ?? '',
              },
            },
          ]
      : (blocksToRichText([{ ...block, kind: block.kind }]).content ?? []),
  );
  return content.length > 0 ? { type: 'doc', content } : emptyRichText;
}

/** An editor document as stored blocks; empty paragraphs are dropped, photos keep their place. */
export function articleBodyFromRichText(doc: ContentRichNode): ArticleBlock[] {
  return (doc.content ?? []).flatMap((node): ArticleBlock[] => {
    if (node.type === photoNode) {
      const photoId = Number(node.attrs?.['photoId']);
      if (!Number.isInteger(photoId) || photoId < 1) return [];
      const alt = String(node.attrs?.['alt'] ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      return [{ kind: 'Image', text: null, lead: null, items: [], photoId, alt: alt || null }];
    }
    return blocksFromRichText({ type: 'doc', content: [node] }).map((block) => ({
      ...block,
      photoId: null,
      alt: null,
    }));
  });
}
