import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Company } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** Title of a footer column: plain text, not a heading, so the footer adds nothing to the page outline. */
export const FOOTER_COLUMN_TITLE =
  'mb-3 font-mono text-xs font-semibold tracking-wider text-brand-soft uppercase';

/** Contacts column: the phone, e-mail, address with the map link, hours and socials. */
export function FooterContacts({
  company,
  locale,
  dictionary,
}: {
  company: Company;
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const [phone] = company.phones;
  return (
    <address className="grid content-start gap-2.5 not-italic">
      <p className={`${FOOTER_COLUMN_TITLE} mb-0.5`}>{dictionary.footerContacts}</p>
      <a
        href={`tel:${phone.e164}`}
        className="text-xl font-extrabold text-primary-foreground hover:text-brand-soft"
      >
        {phone.display}
      </a>
      <a href={`mailto:${company.email}`} className="hover:text-brand-soft">
        {company.email}
      </a>
      <span>
        {company.address.city[locale]}, {company.address.street[locale]}
      </span>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-soft hover:underline"
      >
        {dictionary.showOnMap} <span aria-hidden>→</span>
      </a>
      <span>{company.openingHours.label[locale]}</span>
      <ul aria-label={dictionary.footerSocials} className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        {company.socials.map((social) => (
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
  );
}
