import type { DeliveryDictionary } from '../i18n/delivery-dictionary';

/** Delivery ways as cards with the cost in mono, and the footnote about what the cost depends on. */
export function DeliveryOptions({ dictionary }: { dictionary: DeliveryDictionary['delivery'] }) {
  return (
    <div className="grid gap-6">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {dictionary.options.map((option) => (
          <li key={option.title} className="grid content-start gap-1.5 bg-background p-5">
            <span className="text-sm text-muted-foreground">{option.title}</span>
            <strong className="font-mono text-xl font-semibold">{option.value}</strong>
            <span className="text-sm leading-relaxed text-muted-foreground">{option.text}</span>
          </li>
        ))}
      </ul>
      <p className="max-w-[52rem] text-sm leading-relaxed text-muted-foreground">
        {dictionary.note}
      </p>
    </div>
  );
}
