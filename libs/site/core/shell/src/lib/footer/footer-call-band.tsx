import { requestHref } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import Link from 'next/link';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** Call band on top of the footer: the title, the phone and «Залишити заявку». */
export function FooterCallBand({
  phone,
  locale,
  dictionary,
}: {
  phone: Company['phones'][number];
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  return (
    <div className="border-b border-dashed border-brand-soft/40">
      <div className="mx-auto flex max-w-[77.5rem] flex-wrap items-center gap-x-8 gap-y-5 px-4 py-9 sm:px-6">
        <div className="grid min-w-64 flex-1 gap-2">
          <p className="text-2xl leading-tight font-extrabold tracking-[-0.015em] text-primary-foreground sm:text-[1.75rem]">
            {dictionary.footerCtaTitle}
          </p>
          <p>{dictionary.footerCtaText}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg" className="font-extrabold">
            <a href={`tel:${phone.e164}`}>{phone.display}</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link href={requestHref(locale)} rel="nofollow">
              {dictionary.requestLong}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
