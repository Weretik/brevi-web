import type { WholesaleDictionary } from '../i18n/wholesale-dictionary';

/** The three price levels by quantity. Shows the quantity ranges only: prices come from the manager. */
export function WholesaleTiers({ dictionary }: { dictionary: WholesaleDictionary['tiers'] }) {
  return (
    <div className="grid gap-8">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {dictionary.items.map((tier, index) => (
          <li
            key={tier.range}
            className="grid content-start gap-3 rounded-xl border border-border p-5 last:border-2 last:border-dashed last:border-brand-soft last:bg-muted sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </div>
            <p className="flex items-baseline gap-2">
              <span className="text-[2.5rem] leading-none font-extrabold tracking-[-0.025em]">
                {tier.range}
              </span>
              <span className="text-sm text-muted-foreground">{tier.unit}</span>
            </p>
            <h3 className="text-xl leading-snug font-extrabold">{tier.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{tier.text}</p>
          </li>
        ))}
      </ol>
      <p className="max-w-[52rem] text-sm leading-relaxed text-muted-foreground">
        {dictionary.note}
      </p>
    </div>
  );
}
