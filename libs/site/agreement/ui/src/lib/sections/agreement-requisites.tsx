import { COMPANY } from '@site/core/config';

import { AGREEMENT_TAX_ID } from '../i18n/agreement-dictionary';

import type { AgreementDictionary } from '../i18n/agreement-dictionary';
import type { Locale } from '@site/core/i18n';

/** Seller details that close the offer: company data from `COMPANY`, the site phone, and e-mail. */
export function AgreementRequisites({
  dictionary,
  locale,
}: {
  dictionary: AgreementDictionary['requisites'];
  locale: Locale;
}) {
  const [phone] = COMPANY.phones;
  const { recipient, edrpou, iban, bank } = COMPANY.bankDetails;
  const rows: { term: string; value: string; href?: string }[] = [
    { term: dictionary.recipient, value: recipient[locale] },
    { term: dictionary.edrpou, value: edrpou },
    { term: dictionary.taxId, value: AGREEMENT_TAX_ID },
    { term: dictionary.address, value: dictionary.postalAddress },
    { term: dictionary.iban, value: iban },
    { term: dictionary.bank, value: bank[locale] },
    { term: dictionary.phone, value: phone.display, href: `tel:${phone.e164}` },
    { term: dictionary.email, value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.term} className="grid gap-1 bg-background p-4 sm:p-5">
          <dt className="text-sm text-muted-foreground">{row.term}</dt>
          <dd className="font-bold break-words">
            {row.href ? (
              <a href={row.href} className="hover:text-brand-text">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
