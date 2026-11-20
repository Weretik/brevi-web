import { catalogCategoryPath, localizedPath } from '@site/core/i18n';
import Image from 'next/image';
import Link from 'next/link';

import { FooterCallBand } from './footer-call-band';
import { FOOTER_COLUMN_TITLE, FooterContacts } from './footer-contacts';
import {
  FOOTER_BUYER_LINKS,
  FOOTER_COMPANY_LINKS,
  SHELL_PATHS,
} from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogSection } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

type FooterColumn = { title: string; links: { key: string; href: string; label: string }[] };

/**
 * Dark footer: the call band with the phone and «Залишити заявку», the brand, catalog, buyer and
 * company links, contacts with the map link, and the legal line. Column titles are plain text, not
 * headings, so the footer adds nothing to the page outline; all links are crawlable.
 */
export function SiteFooter({
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
  const page = (links: typeof FOOTER_COMPANY_LINKS) =>
    links.map((link) => ({
      key: link.key,
      href: localizedPath(locale, link.path),
      label: dictionary.links[link.key],
    }));
  const columns: FooterColumn[] = [
    {
      title: dictionary.links.catalog,
      links: [
        ...catalogSections.map((section) => ({
          key: section.key,
          href: localizedPath(locale, catalogCategoryPath(section.slug)),
          label: section.label[locale],
        })),
        {
          key: 'all',
          href: localizedPath(locale, SHELL_PATHS.catalog),
          label: dictionary.allCatalog,
        },
      ],
    },
    { title: dictionary.footerBuyers, links: page(FOOTER_BUYER_LINKS) },
    { title: dictionary.footerCompany, links: page(FOOTER_COMPANY_LINKS) },
  ];

  return (
    <footer className="mt-16 bg-primary text-[0.9375rem] text-primary-foreground/75">
      <FooterCallBand phone={phone} locale={locale} dictionary={dictionary} />

      <div className="mx-auto grid max-w-[77.5rem] gap-x-9 gap-y-10 px-4 py-11 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div className="grid content-start gap-4 sm:col-span-2 lg:col-span-1">
          <span className="justify-self-start rounded-lg bg-background px-3 py-2">
            <Image
              src={company.logo.path}
              alt={company.name}
              width={company.logo.width}
              height={company.logo.height}
              sizes="78px"
              className="h-10 w-auto"
            />
          </span>
          <p className="leading-relaxed">{dictionary.footerAbout}</p>
          <p className="font-mono text-xs font-semibold tracking-wider text-brand-soft uppercase">
            {dictionary.vat}
          </p>
          <Link
            href={localizedPath(locale, SHELL_PATHS.regions)}
            className="justify-self-start font-bold text-primary-foreground hover:text-brand-soft"
          >
            {dictionary.deliveryAll} <span aria-hidden>→</span>
          </Link>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className={FOOTER_COLUMN_TITLE}>{column.title}</p>
            <ul className="grid gap-2.5">
              {column.links.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="hover:text-brand-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <FooterContacts company={company} locale={locale} dictionary={dictionary} />
      </div>

      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-[77.5rem] px-4 py-4 text-[0.8125rem] text-primary-foreground/60 sm:px-6">
          © {new Date().getFullYear()} {company.bankDetails.recipient[locale]} · {dictionary.edrpou}{' '}
          {company.bankDetails.edrpou} · {company.address.city[locale]}
        </p>
      </div>
    </footer>
  );
}
