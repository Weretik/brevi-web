import { CATALOG_SECTIONS } from '@site/catalog/model';
import { COMPANY } from '@site/core/config';
import { catalogCategoryPath, localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import Image from 'next/image';
import Link from 'next/link';

import {
  FOOTER_BUYER_LINKS,
  FOOTER_COMPANY_LINKS,
  SHELL_PATHS,
} from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

type FooterColumn = { title: string; links: { key: string; href: string; label: string }[] };

const COLUMN_TITLE =
  'mb-3 font-mono text-xs font-semibold tracking-wider text-brand-soft uppercase';

/**
 * Dark footer: the call band with the phone and «Залишити заявку», the brand, catalog, buyer and
 * company links, contacts with the map link, and the legal line. Column titles are plain text, not
 * headings, so the footer adds nothing to the page outline; all links are crawlable.
 */
export function SiteFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const [phone] = COMPANY.phones;
  const page = (links: typeof FOOTER_COMPANY_LINKS) =>
    links.map((link) => ({
      key: link.key,
      href: localizedPath(locale, link.path),
      label: dictionary.links[link.key],
    }));
  const columns: FooterColumn[] = [
    {
      title: dictionary.links.catalog,
      links: CATALOG_SECTIONS.map((section) => ({
        key: section.key,
        href: localizedPath(locale, catalogCategoryPath(section.slug)),
        label: section.label[locale],
      })),
    },
    { title: dictionary.footerBuyers, links: page(FOOTER_BUYER_LINKS) },
    { title: dictionary.footerCompany, links: page(FOOTER_COMPANY_LINKS) },
  ];

  return (
    <footer className="mt-16 bg-primary text-[0.9375rem] text-primary-foreground/75 max-lg:pb-17">
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
              <Link href={localizedPath(locale, SHELL_PATHS.request)} rel="nofollow">
                {dictionary.requestLong}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[77.5rem] gap-x-9 gap-y-10 px-4 py-11 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div className="grid content-start gap-4 sm:col-span-2 lg:col-span-1">
          <span className="justify-self-start rounded-lg bg-background px-3 py-2">
            <Image
              src={COMPANY.logo.path}
              alt={COMPANY.name}
              width={COMPANY.logo.width}
              height={COMPANY.logo.height}
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
            <p className={COLUMN_TITLE}>{column.title}</p>
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
        <address className="grid content-start gap-2.5 not-italic">
          <p className={`${COLUMN_TITLE} mb-0.5`}>{dictionary.footerContacts}</p>
          <a
            href={`tel:${phone.e164}`}
            className="text-xl font-extrabold text-primary-foreground hover:text-brand-soft"
          >
            {phone.display}
          </a>
          <a href={`mailto:${COMPANY.email}`} className="hover:text-brand-soft">
            {COMPANY.email}
          </a>
          <span>
            {COMPANY.address.city[locale]}, {COMPANY.address.street[locale]}
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-soft hover:underline"
          >
            {dictionary.showOnMap} <span aria-hidden>→</span>
          </a>
          <span>{COMPANY.openingHours.label[locale]}</span>
          <ul aria-label={dictionary.footerSocials} className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {COMPANY.socials.map((social) => (
              <li key={social.key}>
                {social.url ? (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-foreground hover:text-brand-soft"
                  >
                    {social.label}
                  </a>
                ) : (
                  <span>{social.label}</span>
                )}
              </li>
            ))}
          </ul>
        </address>
      </div>

      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-[77.5rem] px-4 py-4 text-[0.8125rem] text-primary-foreground/60 sm:px-6">
          © {new Date().getFullYear()} {COMPANY.bankDetails.recipient[locale]} · {dictionary.edrpou}{' '}
          {COMPANY.bankDetails.edrpou} · {COMPANY.address.city[locale]}
        </p>
      </div>
    </footer>
  );
}
