import type { SizesDictionary } from '../i18n/sizes-dictionary';

/** Numbered measuring rules for clothing and for shoes, one card each. */
export function MeasureSteps({ dictionary }: { dictionary: SizesDictionary['measure'] }) {
  const groups = [dictionary.clothing, dictionary.shoes];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((group) => (
        <section
          key={group.title}
          className="grid content-start gap-4 rounded-xl border border-border p-5"
        >
          <h3 className="text-lg leading-snug font-extrabold">{group.title}</h3>
          <ol className="grid gap-3">
            {group.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 font-mono text-[0.8125rem] font-semibold text-brand-text">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
