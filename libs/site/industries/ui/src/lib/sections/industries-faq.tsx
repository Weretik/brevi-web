import type { IndustriesDictionary } from '../i18n/industries-dictionary';

/** Frequent questions as plain `<details>`, readable without JavaScript. */
export function IndustriesFaq({ items }: { items: IndustriesDictionary['faq']['items'] }) {
  return (
    <div className="grid max-w-[52rem] gap-2.5">
      {items.map((item) => (
        <details key={item.title} className="group rounded-xl border border-border px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden
              className="font-mono text-lg text-brand-text transition-transform group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
        </details>
      ))}
    </div>
  );
}
