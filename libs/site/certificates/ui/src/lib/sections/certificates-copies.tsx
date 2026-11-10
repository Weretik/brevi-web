import Image from 'next/image';
import Link from 'next/link';

import { CONFORMITY_MARK_PATH } from '../data/certificate-documents';

import type { CertificatesDictionary } from '../i18n/certificates-dictionary';

/** Closing block: certified copies come with the shipment on request. */
export function CertificatesCopies({
  id,
  dictionary,
  contactsHref,
}: {
  id: string;
  dictionary: CertificatesDictionary['copies'];
  contactsHref: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid items-center gap-5 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:p-8"
    >
      <div className="grid gap-4">
        <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
          03 · {dictionary.label}
        </p>
        <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
          {dictionary.title}
        </h2>
        <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.text}</p>
        <p>
          <Link href={contactsHref} className="font-bold text-brand-text hover:underline">
            {dictionary.contacts} <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
      <Image
        src={CONFORMITY_MARK_PATH}
        alt={dictionary.markAlt}
        width={248}
        height={203}
        unoptimized
        className="h-auto w-24 rounded-md sm:w-28"
      />
    </section>
  );
}
