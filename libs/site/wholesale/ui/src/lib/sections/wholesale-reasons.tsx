import Link from 'next/link';

import type { WholesaleDictionary } from '../i18n/wholesale-dictionary';

/** Why enterprises order from Brevi: four named reasons and links to the production and certificates pages. */
export function WholesaleReasons({
  dictionary,
  productionHref,
  certificatesHref,
}: {
  dictionary: WholesaleDictionary['reasons'];
  productionHref: string;
  certificatesHref: string;
}) {
  return (
    <div className="grid gap-8">
      <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {dictionary.items.map((reason) => (
          <li
            key={reason.title}
            className="grid content-start gap-1.5 border-t-2 border-dashed border-brand-soft pt-4"
          >
            <h3 className="leading-snug font-extrabold">{reason.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{reason.text}</p>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
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
