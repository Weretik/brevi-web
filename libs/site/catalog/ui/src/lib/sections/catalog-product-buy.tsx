import { COMPANY } from '@site/core/config';
import { buttonVariants } from '@site/shared/ui';
import Link from 'next/link';

import { CatalogText } from './catalog-text';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogTextBlock } from '@site/catalog/model';

/**
 * Right column of the product page: the model number, short facts, and the way to get a price. The site
 * shows no prices and has no cart, so the actions are the request page and a call.
 */
export function CatalogProductBuy({
  model,
  summary,
  dictionary,
  requestHref,
}: {
  model: string | null;
  summary: readonly CatalogTextBlock[];
  dictionary: CatalogDictionary['product'];
  requestHref: string;
}) {
  const [phone] = COMPANY.phones;

  return (
    <div className="grid gap-6">
      {model ? (
        <p className="text-sm text-muted-foreground">
          {dictionary.model}:{' '}
          <span className="font-mono font-semibold text-foreground">{model}</span>
        </p>
      ) : null}
      {summary.length > 0 ? <CatalogText blocks={summary} className="gap-2.5" /> : null}
      <div className="grid gap-4 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-5">
        <p className="leading-relaxed">{dictionary.priceNote}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={requestHref}
            rel="nofollow"
            className={buttonVariants({ variant: 'brand', size: 'lg' })}
          >
            {dictionary.askPrice}
          </Link>
          <a
            href={`tel:${phone.e164}`}
            className={`${buttonVariants({ variant: 'outline', size: 'lg' })} bg-background`}
          >
            {phone.display}
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold">
          {dictionary.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
