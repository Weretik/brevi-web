import { parseCatalogInline } from '@site/catalog/model';
import { cn } from '@site/shared/ui';

import type { CatalogTextBlock } from '@site/catalog/model';

/** A text of the Admin with its bold and italic parts as `<strong>` and `<em>`. */
function Inline({ text }: { text: string }) {
  return parseCatalogInline(text).map((run, index) => {
    const body = run.italic ? <em>{run.text}</em> : run.text;
    return run.bold ? (
      <strong key={index} className="text-foreground">
        {body}
      </strong>
    ) : (
      <span key={index}>{body}</span>
    );
  });
}

/** The client's text about a category: headings, paragraphs, and lists in the written order. */
export function CatalogText({
  blocks,
  className,
}: {
  blocks: readonly CatalogTextBlock[];
  className?: string;
}) {
  return (
    <div
      className={cn('grid max-w-[48rem] gap-4 leading-relaxed text-muted-foreground', className)}
    >
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === 'heading') {
          return (
            <h3 key={key} className="pt-2 text-lg leading-snug font-extrabold text-foreground">
              <Inline text={block.text} />
            </h3>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={key} className="grid list-disc gap-1.5 pl-5 marker:text-brand">
              {block.items.map((item) => (
                <li key={item}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key}>
            {block.lead ? <strong className="text-foreground">{block.lead} </strong> : null}
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
