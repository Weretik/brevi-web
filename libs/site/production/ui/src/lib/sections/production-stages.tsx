import { ProductionProse } from './production-prose';

import type { ProductionDictionary } from '../i18n/production-dictionary';

/** The three production stages as numbered cards joined by a dashed seam. */
export function ProductionStages({ dictionary }: { dictionary: ProductionDictionary['stages'] }) {
  return (
    <div className="grid gap-8">
      <ProductionProse paragraphs={dictionary.intro} />
      <ol className="grid gap-4 lg:grid-cols-3">
        {dictionary.steps.map((step, index) => (
          <li
            key={step.title}
            className="grid content-start gap-3 rounded-xl border border-border p-5"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </div>
            <h3 className="text-lg leading-snug font-extrabold">{step.title}</h3>
            {step.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
