import { COMPANY } from '@site/core/config';

import { LocaleSwitch } from '../controls/locale-switch';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** Thin line above the header: «Власне швейне виробництво · Полтава», working hours, UA/RU. */
export function TopLine({ locale, dictionary }: { locale: Locale; dictionary: ShellDictionary }) {
  return (
    <div className="border-b border-border text-[0.8125rem] text-muted-foreground">
      <div className="mx-auto flex max-w-[77.5rem] flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 sm:px-6">
        <span className="font-mono text-xs tracking-wide uppercase max-sm:hidden">
          {dictionary.tagline}
        </span>
        <span className="flex-1 max-sm:hidden" />
        <span>{COMPANY.openingHours.label[locale]}</span>
        <span className="flex-1 sm:hidden" />
        <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
      </div>
    </div>
  );
}
