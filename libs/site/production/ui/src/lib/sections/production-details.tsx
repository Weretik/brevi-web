import { ProductionProse } from './production-prose';

import type { ProductionDictionary } from '../i18n/production-dictionary';

/** Threads, seams, and hardware: an intro and two side-by-side text blocks. */
export function ProductionDetails({ dictionary }: { dictionary: ProductionDictionary['details'] }) {
  return (
    <div className="grid gap-8">
      <ProductionProse paragraphs={[dictionary.intro]} />
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
        {dictionary.blocks.map((block) => (
          <div key={block.title} className="grid content-start gap-3 bg-background p-5 sm:p-6">
            <h3 className="text-lg leading-snug font-extrabold">{block.title}</h3>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
