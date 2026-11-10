import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import Image from 'next/image';
import Link from 'next/link';

import { CatalogMenu } from './catalog-menu';
import { HeaderActions } from './header-actions';
import { MobileMenu } from './mobile-menu';
import { NavLink } from '../controls/nav-link';
import { MAIN_NAV_LINKS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

/**
 * Main header row of the «Строчка» mockup: logo, menu with the catalog mega menu, «Заявка», and the phone.
 * It stays on screen while scrolling. Below `lg` the menu moves into the side sheet.
 */
export function SiteHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="relative mx-auto flex max-w-[77.5rem] items-center gap-3 px-4 py-3 sm:px-6 lg:gap-7 lg:py-3.5">
        <MobileMenu locale={locale} dictionary={dictionary} />
        <Link href={localizedPath(locale)} aria-label={dictionary.homeAria} className="shrink-0">
          <Image
            src={COMPANY.logo.path}
            alt={COMPANY.name}
            width={COMPANY.logo.width}
            height={COMPANY.logo.height}
            sizes="74px"
            priority
            className="h-[2.375rem] w-auto"
          />
        </Link>
        <nav
          aria-label={dictionary.mainNav}
          className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1 text-[0.9375rem] font-semibold max-lg:hidden"
        >
          <CatalogMenu locale={locale} dictionary={dictionary} />
          {MAIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.key}
              href={localizedPath(locale, link.path)}
              className="rounded-sm aria-[current=page]:text-brand-text"
            >
              {dictionary.links[link.key]}
            </NavLink>
          ))}
        </nav>
        <div className="max-lg:ml-auto">
          <HeaderActions locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
