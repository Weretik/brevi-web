import type { CatalogTextBlock } from '@site/catalog/model';

/** The client's text about a category: headings, paragraphs, and lists in the written order. */
export function CatalogText({ blocks }: { blocks: readonly CatalogTextBlock[] }) {
  return (
    <div className="grid max-w-[48rem] gap-4 leading-relaxed text-muted-foreground">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === 'heading') {
          return (
            <h3 key={key} className="pt-2 text-lg leading-snug font-extrabold text-foreground">
              {block.text}
            </h3>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={key} className="grid list-disc gap-1.5 pl-5 marker:text-brand">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}
