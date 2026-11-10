import { COMPANY } from '@site/core/config';

import { LocaleSwitch } from '../controls/locale-switch';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** Thin line above the header: «Власне швейне виробництво · Полтава», working hours, the office phone, UA/RU. */
export function TopLine({ locale, dictionary }: { locale: Locale; dictionary: ShellDictionary }) {
  const officePhone = COMPANY.phones[1];

  return (
    <div className="border-b border-border text-[0.8125rem] text-muted-foreground">
      <div className="mx-auto flex max-w-[77.5rem] flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 sm:px-6">
        <span className="font-mono text-xs tracking-wide uppercase max-sm:hidden">
          {dictionary.tagline}
        </span>
        <span className="flex-1 max-sm:hidden" />
        <span>{COMPANY.openingHours.label[locale]}</span>
        <a
          href={`tel:${officePhone.e164}`}
          className="font-mono hover:text-brand-text max-sm:ml-auto"
        >
          {officePhone.display}
        </a>
        <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
      </div>
    </div>
  );
}
