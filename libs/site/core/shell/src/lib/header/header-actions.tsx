import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { ClipboardListIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/**
 * «Заявка» and the sales phone. Wide screens show the labels; phones and tablets show two icon buttons.
 * The request counter is added by the request feature.
 */
export function HeaderActions({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const [salesPhone] = COMPANY.phones;

  return (
    <div className="flex items-center gap-2 xl:gap-3">
      <Button asChild variant="outline" className="max-xl:size-11 max-xl:px-0">
        <Link
          href={localizedPath(locale, SHELL_PATHS.request)}
          rel="nofollow"
          aria-label={dictionary.request}
        >
          <ClipboardListIcon aria-hidden strokeWidth={1.75} />
          <span className="max-xl:hidden">{dictionary.request}</span>
        </Link>
      </Button>
      <Button asChild className="text-[0.9375rem] max-xl:size-11 max-xl:px-0">
        <a href={`tel:${salesPhone.e164}`} aria-label={`${dictionary.call}: ${salesPhone.display}`}>
          <PhoneIcon aria-hidden className="text-brand" strokeWidth={2} />
          <span className="font-mono max-xl:hidden">{salesPhone.display}</span>
        </a>
      </Button>
    </div>
  );
}
