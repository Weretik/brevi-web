import type { LogoPrintingDictionary } from '../i18n/logo-printing-dictionary';

/** Kinds of workwear Brevi brands: an intro and a list of named rows. */
export function LogoPrintingGarments({
  dictionary,
}: {
  dictionary: LogoPrintingDictionary['garments'];
}) {
  return (
    <div className="grid gap-8">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {dictionary.items.map((item) => (
          <li
            key={item.title}
            className="grid content-start gap-1.5 bg-background p-5 last:sm:col-span-2"
          >
            <h3 className="leading-snug font-extrabold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
