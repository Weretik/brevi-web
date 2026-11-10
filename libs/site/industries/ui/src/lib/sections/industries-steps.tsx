import type { IndustriesDictionary } from '../i18n/industries-dictionary';

/** How to get a quote: an intro and three numbered steps. */
export function IndustriesSteps({ dictionary }: { dictionary: IndustriesDictionary['steps'] }) {
  return (
    <div className="grid gap-8">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {dictionary.items.map((step, index) => (
          <li
            key={step.title}
            className="grid content-start gap-3 rounded-xl border border-border p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </div>
            <h3 className="text-xl leading-snug font-extrabold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
