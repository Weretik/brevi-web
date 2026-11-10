import Link from 'next/link';

import type { LogoPrintingDictionary } from '../i18n/logo-printing-dictionary';

/** Custom sewing with a logo: two paragraphs and links to the production and certificates pages. */
export function LogoPrintingSewing({
  dictionary,
  productionHref,
  certificatesHref,
}: {
  dictionary: LogoPrintingDictionary['sewing'];
  productionHref: string;
  certificatesHref: string;
}) {
  return (
    <div className="grid max-w-[52rem] gap-4">
      {dictionary.paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
      <p className="flex flex-wrap gap-x-6 gap-y-2 pt-1 font-bold">
        <Link href={productionHref} className="text-brand-text hover:underline">
          {dictionary.production} <span aria-hidden>→</span>
        </Link>
        <Link href={certificatesHref} className="text-brand-text hover:underline">
          {dictionary.certificates} <span aria-hidden>→</span>
        </Link>
      </p>
    </div>
  );
}
