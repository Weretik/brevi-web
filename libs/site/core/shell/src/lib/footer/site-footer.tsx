import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import Image from 'next/image';
import Link from 'next/link';

import { CATALOG_SECTIONS } from '../navigation/catalog-sections';
import {
  FOOTER_BUYER_LINKS,
  FOOTER_COMPANY_LINKS,
  SHELL_PATHS,
} from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

type FooterColumn = { title: string; links: { key: string; href: string; label: string }[] };

/** Footer of the «Строчка» mockup: brand, catalog, company and buyer pages, contacts; all links are crawlable. */
export function SiteFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const page = (links: typeof FOOTER_COMPANY_LINKS) =>
    links.map((link) => ({
      key: link.key,
      href: localizedPath(locale, link.path),
      label: dictionary.links[link.key],
    }));
  const columns: FooterColumn[] = [
    {
      title: dictionary.links.catalog,
      // Category slugs arrive with the BreviERP category tree; until then every section opens the catalog root.
      links: CATALOG_SECTIONS.map((section) => ({
        key: section.key,
        href: localizedPath(locale, SHELL_PATHS.catalog),
        label: section.label[locale],
      })),
    },
    { title: dictionary.footerCompany, links: page(FOOTER_COMPANY_LINKS) },
    { title: dictionary.footerBuyers, links: page(FOOTER_BUYER_LINKS) },
  ];

  return (
    <footer className="mt-16 border-t border-border text-sm text-muted-foreground">
      <div className="mx-auto grid max-w-[77.5rem] gap-x-7 gap-y-9 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.1fr_repeat(4,1fr)]">
        <div className="grid content-start gap-2.5 sm:col-span-2 lg:col-span-1">
          <Image
            src={COMPANY.logo.path}
            alt={COMPANY.name}
            width={COMPANY.logo.width}
            height={COMPANY.logo.height}
            sizes="62px"
            className="h-8 w-auto justify-self-start"
          />
          <span>{dictionary.footerTagline}</span>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-2 font-extrabold text-foreground">{column.title}</h2>
            <ul className="grid gap-1.5">
              {column.links.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="hover:text-brand-text">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <address className="grid content-start gap-1.5 not-italic">
          <h2 className="mb-0.5 font-extrabold text-foreground">{dictionary.footerContacts}</h2>
          {COMPANY.phones.map((phone) => (
            <a
              key={phone.e164}
              href={`tel:${phone.e164}`}
              className="font-mono font-semibold text-foreground hover:text-brand-text"
            >
              {phone.display}
            </a>
          ))}
          <a href={`mailto:${COMPANY.email}`} className="hover:text-brand-text">
            {COMPANY.email}
          </a>
          <span>
            {COMPANY.address.city[locale]}, {COMPANY.address.street[locale]}
          </span>
          <span>{COMPANY.openingHours.label[locale]}</span>
        </address>
      </div>
      <p className="mx-auto max-w-[77.5rem] px-4 sm:px-6">
        <span className="block border-t border-dashed border-border-strong pt-3.5 pb-6 text-[0.8125rem]">
          © {new Date().getFullYear()}, {dictionary.copyright}
        </span>
      </p>
    </footer>
  );
}
