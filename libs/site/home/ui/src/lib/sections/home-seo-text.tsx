import type { HomeDictionary } from '../i18n/home-dictionary';

/** SEO text on the left and the FAQ on the right; the FAQ is plain `<details>`, readable without JavaScript. */
export function HomeSeoText({ dictionary }: { dictionary: HomeDictionary['seo'] }) {
  return (
    <section
      aria-labelledby="home-seo-title"
      className="grid gap-x-12 gap-y-8 border-t border-border pt-10 lg:grid-cols-2"
    >
      <article className="grid content-start gap-4">
        <h2 id="home-seo-title" className="text-[1.375rem] leading-tight font-extrabold">
          {dictionary.title}
        </h2>
        <p className="leading-relaxed text-muted-foreground">{dictionary.intro}</p>
        {dictionary.blocks.map((block) => (
          <div key={block.title} className="grid gap-1.5">
            <h3 className="font-extrabold">{block.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>
          </div>
        ))}
      </article>
      <div className="grid content-start gap-2.5">
        <h2 className="mb-1.5 text-[1.375rem] leading-tight font-extrabold">
          {dictionary.faqTitle}
        </h2>
        {dictionary.faq.map((item) => (
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
    </section>
  );
}
