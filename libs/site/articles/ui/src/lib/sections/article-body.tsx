import Image from 'next/image';

import { ArticleInline } from './article-inline';

import type { ArticleBlock } from '@site/articles/model';

const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;

/**
 * Article text in reading order: headings, paragraphs with an optional bold lead, bulleted lists, and
 * pictures from the CDN at a readable line width.
 */
export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className="grid max-w-[46rem] gap-5 text-[1.0625rem] leading-[1.75]">
      {blocks.map((block, index) => {
        // Blocks have no ids and never reorder, so the position is a stable key.
        const key = `${block.type}-${index}`;

        if (block.type === 'heading') {
          return (
            <h2 key={key} className="pt-3 text-[1.375rem] leading-snug font-extrabold">
              <ArticleInline text={block.text} />
            </h2>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={key} className="grid list-disc gap-2 pl-6 marker:text-brand">
              {block.items.map((item, line) => (
                <li key={`${line}-${item}`}>
                  <ArticleInline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'image') {
          const { photo } = block;
          // A photo without a known size gets a common one for the space it takes while it loads; `h-auto`
          // then keeps its own proportions.
          return (
            <Image
              key={key}
              src={photo.src}
              alt={block.alt}
              width={photo.width ?? FALLBACK_WIDTH}
              height={photo.height ?? FALLBACK_HEIGHT}
              sizes="(min-width: 768px) 46rem, 100vw"
              unoptimized
              className="h-auto w-full rounded-lg border border-border"
            />
          );
        }
        return (
          <p key={key}>
            {block.lead ? <strong>{block.lead} </strong> : null}
            <ArticleInline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
