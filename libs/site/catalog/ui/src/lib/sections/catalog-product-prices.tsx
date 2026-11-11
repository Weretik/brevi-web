'use client';

import { cn } from '@site/shared/ui';
import { useState } from 'react';

import { formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogFabric, CatalogPriceTiers } from '@site/catalog/model';

const TIERS = ['retail', 'wholesale', 'largeWholesale'] as const;

type Labels = {
  fabric: string;
  prices: string;
  tiers: Record<(typeof TIERS)[number], string>;
  /** Shown instead of the prices when a manager quotes them. */
  priceNote: string;
};

/**
 * Prices of a product by order size. A sewing model has a price for each fabric: the visitor picks the
 * fabric and sees its prices; without JavaScript the first fabric stays chosen. Protective equipment has
 * one set of prices. Without any price the block says a manager will quote it.
 */
export function CatalogProductPrices({
  fabrics,
  prices,
  labels,
}: {
  fabrics: readonly CatalogFabric[];
  prices: CatalogPriceTiers | null;
  labels: Labels;
}) {
  const [chosenSku, setChosenSku] = useState<string | null>(null);
  const fabric = fabrics.find((item) => item.sku === chosenSku) ?? fabrics[0];
  const shown = fabric ? fabric.prices : prices;

  return (
    <div className="grid gap-4">
      {fabric ? (
        <fieldset className="grid gap-2.5">
          <legend className="mb-2.5 font-mono text-xs font-semibold tracking-wider text-brand-text uppercase">
            {labels.fabric}
          </legend>
          {fabrics.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {fabrics.map((item) => (
                <button
                  key={item.sku}
                  type="button"
                  aria-pressed={item.sku === fabric.sku}
                  onClick={() => setChosenSku(item.sku)}
                  className={cn(
                    'min-h-11 rounded-md border bg-background px-3.5 text-left text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.sku === fabric.sku
                      ? 'border-2 border-brand'
                      : 'border-border-strong hover:border-foreground',
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="font-bold">{fabric.name}</p>
          )}
          {fabric.details ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{fabric.details}</p>
          ) : null}
        </fieldset>
      ) : null}

      {shown ? (
        <table className="w-full border-collapse text-left" aria-live="polite">
          <caption className="pb-2 text-left font-mono text-xs font-semibold tracking-wider text-brand-text uppercase">
            {labels.prices}
          </caption>
          <tbody>
            {TIERS.map((tier) => (
              <tr key={tier} className="border-t border-border-strong last:border-b">
                <th scope="row" className="py-2.5 pr-4 font-normal text-muted-foreground">
                  {labels.tiers[tier]}
                </th>
                <td className="py-2.5 text-right text-lg font-extrabold">
                  {formatPrice(shown[tier])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="leading-relaxed">{labels.priceNote}</p>
      )}
    </div>
  );
}
