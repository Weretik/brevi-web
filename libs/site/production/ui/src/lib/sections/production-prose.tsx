import { cn } from '@site/shared/ui';

/** Paragraphs of a text block, limited to a readable line length. */
export function ProductionProse({
  paragraphs,
  className,
}: {
  paragraphs: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn('grid max-w-[52rem] gap-4', className)}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
