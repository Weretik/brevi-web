import { COMPANY } from '@site/core/config';

import type { DeliveryDictionary } from '../i18n/delivery-dictionary';
import type { Locale } from '@site/core/i18n';

/** Payment rules on the left and the bank details from `COMPANY` on the right. */
export function DeliveryPayment({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: DeliveryDictionary['payment'];
}) {
  const { bankDetails } = COMPANY;
  const rows = [
    { name: dictionary.recipient, value: bankDetails.recipient[locale], mono: false },
    { name: dictionary.edrpou, value: bankDetails.edrpou, mono: true },
    { name: dictionary.iban, value: bankDetails.iban, mono: true },
    { name: dictionary.bank, value: bankDetails.bank[locale], mono: false },
  ];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="grid gap-4">
        {dictionary.paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="rounded-xl border-2 border-dashed border-brand-soft p-5 sm:p-6">
        <h3 className="text-lg font-extrabold">{dictionary.detailsTitle}</h3>
        <dl className="mt-4 grid gap-3">
          {rows.map((row) => (
            <div key={row.name} className="grid gap-0.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-sm text-muted-foreground">{row.name}</dt>
              <dd className={row.mono ? 'font-mono font-semibold break-words' : 'font-semibold'}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
