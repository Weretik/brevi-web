import { COMPANY } from '@site/core/config';
import { StitchLabel } from '@site/shared/ui';

import type { RequestDictionary } from '../i18n/request-dictionary';

/** Left column: `h1`, one lead sentence, what happens after the request, and the phone for those in a hurry. */
export function RequestIntro({ dictionary }: { dictionary: RequestDictionary }) {
  const [phone] = COMPANY.phones;

  return (
    <div className="grid content-start gap-6">
      <StitchLabel index="01">{dictionary.label}</StitchLabel>
      <h1 className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.025em] sm:text-[2.75rem]">
        {dictionary.title}
      </h1>
      <p className="max-w-[32rem] text-lg leading-relaxed text-muted-foreground">
        {dictionary.lead}
      </p>
      <ol aria-label={dictionary.stepsLabel} className="grid gap-4 pt-2">
        {dictionary.steps.map((step, index) => (
          <li key={step.title} className="flex items-baseline gap-4">
            <span className="font-mono text-[0.8125rem] font-semibold text-brand-text">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="leading-normal">
              <strong className="font-extrabold">{step.title}</strong> {step.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="border-t pt-5 text-[0.9375rem] text-muted-foreground">
        {dictionary.callNow}{' '}
        <a
          href={`tel:${phone.e164}`}
          className="font-extrabold whitespace-nowrap text-foreground hover:underline"
        >
          {phone.display}
        </a>
      </p>
    </div>
  );
}
