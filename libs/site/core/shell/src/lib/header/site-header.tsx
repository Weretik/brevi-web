import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CatalogMenu } from './catalog-menu';
import { ShowWhenStuck } from './show-when-stuck';
import { LocaleSwitch } from '../controls/locale-switch';
import { NavLink } from '../controls/nav-link';
import { MAIN_NAV_LINKS, SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/** Height of the contacts row on wide screens, in px; the header slides up by it so only the menu row sticks. */
const CONTACTS_ROW_HEIGHT = 80;

/**
 * Two-row header. Contacts row: logo with the brand line, the short terms, phone with hours and e-mail,
 * «Залишити заявку». Menu row: the «Каталог» button, the site menu, and the language toggle; it stays on
 * screen while scrolling and then also shows the phone.
 * Below `lg` only the logo and the language toggle remain; the actions live in the bottom bar.
 */
export function SiteHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const [phone] = COMPANY.phones;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background lg:-top-20">
      <div className="mx-auto flex h-15 max-w-[77.5rem] items-center gap-4 px-4 sm:px-6 lg:h-20 lg:gap-7">
        <Link
          href={localizedPath(locale)}
          aria-label={dictionary.homeAria}
          className="flex shrink-0 items-center gap-3.5"
        >
          <Image
            src={COMPANY.logo.path}
            alt={COMPANY.name}
            width={COMPANY.logo.width}
            height={COMPANY.logo.height}
            sizes="100px"
            priority
            className="h-9 w-auto lg:h-13"
          />
          <span className="grid border-l border-border-strong pl-3.5 text-xs leading-snug text-muted-foreground lg:text-[0.8125rem]">
            <b className="font-bold text-foreground">{dictionary.brandLine}</b>
            {dictionary.brandSubline}
          </span>
        </Link>
        <span className="flex-1" />
        <span className="font-mono text-xs font-semibold tracking-wide whitespace-nowrap text-muted-foreground uppercase max-xl:hidden">
          {dictionary.perks}
        </span>
        <span className="flex-1 max-xl:hidden" />
        <div className="flex items-center gap-3 max-lg:hidden">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-surface text-brand-text">
            <PhoneIcon aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <span className="grid leading-tight">
            <a
              href={`tel:${phone.e164}`}
              aria-label={`${dictionary.call}: ${phone.display}`}
              className="text-lg font-extrabold whitespace-nowrap hover:text-brand-text"
            >
              {phone.display}
            </a>
            <span className="text-xs text-muted-foreground">
              {COMPANY.openingHours.label[locale]} ·{' '}
              <a href={`mailto:${COMPANY.email}`} className="hover:text-brand-text">
                {COMPANY.email}
              </a>
            </span>
          </span>
        </div>
        <Button asChild variant="brand" className="h-12 px-6 text-[0.9375rem] max-lg:hidden">
          <Link href={localizedPath(locale, SHELL_PATHS.request)} rel="nofollow">
            {dictionary.requestLong}
          </Link>
        </Button>
        <div className="lg:hidden">
          <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
        </div>
      </div>

      <div className="border-t border-border bg-muted max-lg:hidden">
        <div className="relative mx-auto flex h-14 max-w-[77.5rem] items-center gap-5 px-6 xl:gap-7">
          <CatalogMenu locale={locale} dictionary={dictionary} />
          <nav
            aria-label={dictionary.mainNav}
            className="flex min-w-0 flex-1 items-center gap-x-4 text-sm font-semibold xl:gap-x-7 xl:text-[0.9375rem]"
          >
            {MAIN_NAV_LINKS.map((link) => (
              <NavLink
                key={link.key}
                href={localizedPath(locale, link.path)}
                className="rounded-sm whitespace-nowrap aria-[current=page]:text-brand-text"
              >
                {dictionary.links[link.key]}
              </NavLink>
            ))}
          </nav>
          <ShowWhenStuck offset={CONTACTS_ROW_HEIGHT}>
            <a
              href={`tel:${phone.e164}`}
              className="text-base font-extrabold whitespace-nowrap hover:text-brand-text"
            >
              {phone.display}
            </a>
          </ShowWhenStuck>
          <LocaleSwitch locale={locale} label={dictionary.languageSwitch} />
        </div>
      </div>
    </header>
  );
}
