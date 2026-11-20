import { ChevronDownIcon } from 'lucide-react';

/**
 * Questions of a city page, each folded under its question. The answers stay in the HTML, and the page marks the
 * same questions up as `FAQPage`.
 */
export function CityFaq({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="grid max-w-[52rem] border-t border-border">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg leading-snug font-bold [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDownIcon
              aria-hidden
              className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              strokeWidth={1.75}
            />
          </summary>
          <p className="pb-5 leading-relaxed text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
