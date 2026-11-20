import { localizedPath, requestHref } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { HeaderSearch } from './header-search';
import { ShowWhenStuck } from './show-when-stuck';
import { LocaleSwitch } from '../../controls/locale-switch';
import { NavLink } from '../../controls/nav-link';
import { MobileHeaderActions } from '../../mobile/mobile-header-actions';
import { MAIN_NAV_LINKS } from '../../navigation/site-navigation';
import { CatalogMenu } from '../catalog-menu/catalog-menu';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** Height of the contacts row on wide screens, in px; the header slides up by it so only the menu row sticks. */
const CONTACTS_ROW_HEIGHT = 80;

/**
 * Two-row header. Contacts row: logo with the brand line, phone with hours and e-mail, «Залишити заявку»
 * (opens the request window). Menu row: the «Каталог» button, the site menu, «Пошук», and the language
 * toggle; it stays on screen while scrolling and then also shows the phone.
 * Below `lg` the header is one row: the logo with the brand line, then the phone, «Каталог» and «Меню».
 */
export function SiteHeader({
  company,
  locale,
  dictionary,
  catalogSections,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  locale: Locale;
  dictionary: ShellDictionary;
  catalogSections: readonly CatalogSection[];
}) {
  const [phone] = company.phones;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background lg:-top-20">
      <div className="mx-auto flex h-15 max-w-[77.5rem] items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:h-20 lg:gap-7">
        <Link
          href={localizedPath(locale)}
          aria-label={dictionary.homeAria}
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3.5"
        >
          <Image
            src={company.logo.path}
            alt={company.name}
            width={company.logo.width}
            height={company.logo.height}
            sizes="100px"
            priority
            className="h-7 w-auto sm:h-9 lg:h-13"
          />
          <span className="grid border-l border-border-strong pl-2 text-[0.6875rem] leading-tight text-muted-foreground max-sm:max-w-[5.25rem] max-sm:text-[0.625rem] sm:pl-3.5 sm:text-xs sm:leading-snug lg:text-[0.8125rem]">
            <b className="font-bold text-foreground">{dictionary.brandLine}</b>
            <span className="max-sm:hidden">{dictionary.brandSubline}</span>
          </span>
        </Link>
        <span className="flex-1" />
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
              {company.openingHours.label[locale]} ·{' '}
              <a href={`mailto:${company.email}`} className="hover:text-brand-text">
                {company.email}
              </a>
            </span>
          </span>
        </div>
        <Button asChild variant="brand" className="h-12 px-6 text-[0.9375rem] max-lg:hidden">
          <Link href={requestHref(locale)} rel="nofollow">
            {dictionary.requestLong}
          </Link>
        </Button>
        <MobileHeaderActions
          company={company}
          locale={locale}
          dictionary={dictionary}
          catalogSections={catalogSections}
        />
      </div>

      <div className="border-t border-border bg-muted max-lg:hidden">
        <div className="relative mx-auto flex h-14 max-w-[77.5rem] items-center gap-4 px-6">
          <CatalogMenu locale={locale} dictionary={dictionary} sections={catalogSections} />
          <nav
            aria-label={dictionary.mainNav}
            className="flex min-w-0 flex-1 items-center gap-x-3 text-[0.8125rem] font-semibold xl:gap-x-4 xl:text-sm"
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
          <HeaderSearch locale={locale} />
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
