import { agreementSectionId } from '../i18n/agreement-dictionary';

import type { AgreementSection } from '../data/agreement-text';

/** Table of contents: anchor links to the sections of the offer. */
export function AgreementContents({
  label,
  sections,
}: {
  label: string;
  sections: readonly AgreementSection[];
}) {
  return (
    <nav
      aria-label={label}
      className="rounded-xl border-2 border-dashed border-brand-soft bg-muted p-5 sm:p-6"
    >
      <p className="mb-3 font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        {label}
      </p>
      <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {sections.map((section) => (
          <li key={section.number}>
            <a
              href={`#${agreementSectionId(section.number)}`}
              className="flex gap-2.5 leading-snug font-bold hover:text-brand-text"
            >
              <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
                {section.number.padStart(2, '0')}
              </span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
