import Image from 'next/image';

import type { ArticleBlock } from '@site/articles/model';

/** Article text in reading order: paragraphs, bulleted lists, and pictures at a readable line width. */
export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className="grid max-w-[46rem] gap-5 text-[1.0625rem] leading-[1.75]">
      {blocks.map((block, index) => {
        // Blocks have no ids and never reorder, so the position is a stable key.
        const key = `${block.type}-${index}`;

        if (block.type === 'list') {
          return (
            <ul key={key} className="grid list-disc gap-2 pl-6 marker:text-brand">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'image') {
          return (
            <Image
              key={key}
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              unoptimized
              className="h-auto w-full rounded-lg border border-border"
            />
          );
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}
