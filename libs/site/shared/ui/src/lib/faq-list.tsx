import { cn } from './cn';

export type FaqListItem = { question: string; answer: string };

/** Frequent questions as plain `<details>`, readable without JavaScript. */
export function FaqList({
  items,
  className,
}: {
  items: readonly FaqListItem[];
  className?: string;
}) {
  return (
    <div className={cn('grid gap-2.5', className)}>
      {items.map((item) => (
        <details key={item.question} className="group rounded-xl border border-border px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden
              className="font-mono text-lg text-brand-text transition-transform group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
