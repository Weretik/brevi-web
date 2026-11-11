import { buttonVariants } from '@site/shared/ui';
import Link from 'next/link';

import { CatalogProductPrices } from './catalog-product-prices';
import { CatalogText } from './catalog-text';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogFabric, CatalogPriceTiers, CatalogTextBlock } from '@site/catalog/model';
import type { Company } from '@site/core/config';

/**
 * Right column of the product page: the model number, short facts, the prices by order size (of the chosen
 * fabric for a sewing model), and the way to order. The site has no cart, so the actions are the request
 * page and a call; a product without a price asks to learn it from a manager.
 */
export function CatalogProductBuy({
  company,
  model,
  summary,
  fabrics,
  prices,
  dictionary,
  requestHref,
}: {
  /** Company facts from «Контакти та компанія». */
  company: Company;
  model: string | null;
  summary: readonly CatalogTextBlock[];
  /** Fabrics of a sewing model with their prices; empty for protective equipment. */
  fabrics: readonly CatalogFabric[];
  /** Prices of a product without fabrics. */
  prices: CatalogPriceTiers | null;
  dictionary: CatalogDictionary['product'];
  requestHref: string;
}) {
  const [phone] = company.phones;
  const priced = prices !== null || fabrics.some((fabric) => fabric.prices !== null);

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
        <CatalogProductPrices
          fabrics={fabrics}
          prices={prices}
          labels={{
            fabric: dictionary.fabric,
            prices: dictionary.prices,
            tiers: dictionary.tiers,
            priceNote: dictionary.priceNote,
          }}
        />
        {priced ? <p className="text-sm leading-relaxed">{dictionary.orderNote}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Link
            href={requestHref}
            rel="nofollow"
            className={buttonVariants({ variant: 'brand', size: 'lg' })}
          >
            {priced ? dictionary.request : dictionary.askPrice}
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
