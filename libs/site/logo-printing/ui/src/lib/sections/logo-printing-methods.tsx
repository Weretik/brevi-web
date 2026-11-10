import { CheckIcon } from 'lucide-react';

import type { LogoPrintingDictionary } from '../i18n/logo-printing-dictionary';

/** The three branding methods as numbered cards: what the method is and its advantages. */
export function LogoPrintingMethods({
  dictionary,
}: {
  dictionary: LogoPrintingDictionary['methods'];
}) {
  return (
    <div className="grid gap-8">
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.intro}</p>
      <ol className="grid gap-4 lg:grid-cols-3">
        {dictionary.items.map((method, index) => (
          <li
            key={method.key}
            className="grid content-start gap-3 rounded-xl border border-border p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="flex-1 border-t-2 border-dashed border-brand-soft" />
            </div>
            <h3 className="text-xl leading-snug font-extrabold">{method.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{method.summary}</p>
            <ul aria-label={dictionary.advantages} className="grid gap-2 pt-1 text-sm">
              {method.points.map((point) => (
                <li key={point} className="flex gap-2.5 leading-relaxed">
                  <CheckIcon
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-brand-text"
                    strokeWidth={2.25}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
