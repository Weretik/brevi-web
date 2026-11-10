import { cn } from '@site/shared/ui';

import { agreementSectionId } from '../i18n/agreement-dictionary';

import type { AgreementSection as AgreementSectionData } from '../data/agreement-text';

/** One section of the offer: a numbered `h2` and its clauses; sub-clauses are indented by their depth. */
export function AgreementSection({ section }: { section: AgreementSectionData }) {
  const id = agreementSectionId(section.number);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid scroll-mt-40 gap-4 border-t border-border pt-6"
    >
      <h2
        id={`${id}-title`}
        className="text-xl leading-tight font-extrabold tracking-[-0.015em] sm:text-2xl"
      >
        <span className="mr-2 font-mono text-[0.8125rem] font-semibold text-brand-text">
          {section.number.padStart(2, '0')}
        </span>
        {section.title}
      </h2>
      <ul className="grid gap-3">
        {section.clauses.map((clause) => (
          <li
            key={clause.number}
            className={cn(
              'grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 leading-relaxed',
              clause.number.split('.').length > 2 && 'sm:pl-8',
            )}
          >
            <span className="font-mono text-[0.8125rem] leading-[1.9] font-semibold text-muted-foreground">
              {clause.number}.
            </span>
            <span>{clause.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
