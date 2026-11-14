import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';

import { CatalogProductPrices } from './catalog-product-prices';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogFabric, CatalogPriceTiers } from '@site/catalog/model';
import type { Company } from '@site/core/config';
import type { ReactNode } from 'react';

/**
 * Order card of the product page: the lowest price, the fabrics, the prices by order size, and the way to
 * order. The site has no cart, so the actions are the request page and a call; a product without a price
 * asks to learn it from a manager. `children` go at the bottom of the card, for example the size chart.
 */
export function CatalogProductBuy({
  id,
  company,
  fabrics,
  prices,
  dictionary,
  requestHref,
  children,
}: {
  /** Anchor of the card; the price bar on phones hides while the card is on the screen. */
  id?: string;
  /** Company facts from «Контакти та компанія». */
  company: Company;
  /** Fabrics of a sewing model with their prices; empty for protective equipment. */
  fabrics: readonly CatalogFabric[];
  /** Prices of a product without fabrics. */
  prices: CatalogPriceTiers | null;
  dictionary: CatalogDictionary['product'];
  requestHref: string;
  children?: ReactNode;
}) {
  const [phone] = company.phones;
  const priced = prices !== null || fabrics.some((fabric) => fabric.prices !== null);

  return (
    <div
      id={id}
      className="grid gap-5 rounded-xl border border-border-strong bg-background p-5 shadow-[0_6px_24px_rgb(38_38_38/0.06)] sm:p-6"
    >
      <CatalogProductPrices
        fabrics={fabrics}
        prices={prices}
        labels={{
          fabric: dictionary.fabric,
          prices: dictionary.prices,
          tiers: dictionary.tiers,
          priceNote: dictionary.priceNote,
          priceFrom: dictionary.priceFrom,
          priceFromNote: dictionary.priceFromNote,
          saving: dictionary.saving,
          currency: dictionary.currency,
        }}
      />
      <div className="grid gap-2.5">
        <div className="flex flex-wrap gap-3">
          <Link
            href={requestHref}
            rel="nofollow"
            className={cn(buttonVariants({ variant: 'brand', size: 'lg' }), 'flex-1')}
          >
            {priced ? dictionary.request : dictionary.askPrice}
          </Link>
          <a
            href={`tel:${phone.e164}`}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'flex-1 sm:flex-none',
            )}
          >
            {phone.display}
          </a>
        </div>
        {priced ? <p className="text-sm text-muted-foreground">{dictionary.orderNote}</p> : null}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold">
        {dictionary.facts.map((fact) => (
          <li key={fact} className="flex items-center gap-1.5">
            <span aria-hidden className="text-brand-text">
              ✓
            </span>
            {fact}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
