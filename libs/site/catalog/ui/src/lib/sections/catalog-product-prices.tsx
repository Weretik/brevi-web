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
  /** «від» before the lowest price. */
  priceFrom: string;
  /** What the lowest price is: per piece from 40 pieces. */
  priceFromNote: string;
  /** Word before the saving per piece, «Економія». */
  saving: string;
  /** «грн/шт» after the saving. */
  currency: string;
};

/** How much cheaper one piece is than at 1–9 pieces, in whole hryvnias; `null` when it is not cheaper. */
function savingPerPiece(prices: CatalogPriceTiers, tier: (typeof TIERS)[number]): number | null {
  if (tier === 'retail') return null;
  const saving = Math.round(prices.retail - prices[tier]);
  return saving >= 1 ? saving : null;
}

/**
 * Prices of a product by order size. The lowest price stands first in large type; below it a sewing model
 * offers its fabrics as cards with their composition, and the three prices by order size show how much
 * cheaper one piece is in hryvnias in a larger order. Picking a fabric changes the prices; without JavaScript the first fabric stays
 * chosen. Protective equipment has one set of prices. Without any price the block says a manager will
 * quote it.
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
    <div className="grid gap-5">
      {shown ? (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1" aria-live="polite">
          <span className="text-[1.75rem] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
            {`${labels.priceFrom} ${formatPrice(shown.largeWholesale)}`}
          </span>
          <span className="text-sm text-muted-foreground">{labels.priceFromNote}</span>
        </p>
      ) : null}

      {fabric ? (
        <fieldset className="grid gap-2.5">
          <legend className="mb-2.5 font-mono text-xs font-semibold tracking-wider text-brand-text uppercase">
            {labels.fabric}
          </legend>
          {fabrics.length > 1 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {fabrics.map((item) => (
                <button
                  key={item.sku}
                  type="button"
                  aria-pressed={item.sku === fabric.sku}
                  onClick={() => setChosenSku(item.sku)}
                  className={cn(
                    'grid content-start gap-0.5 rounded-md border bg-background px-3.5 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.sku === fabric.sku
                      ? 'border-2 border-brand px-[0.8125rem] py-[0.5625rem]'
                      : 'border-border-strong hover:border-foreground',
                  )}
                >
                  <span className="text-sm font-bold">{item.name}</span>
                  {item.details ? (
                    <span className="text-xs leading-snug text-muted-foreground">
                      {item.details}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-0.5">
              <p className="font-bold">{fabric.name}</p>
              {fabric.details ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{fabric.details}</p>
              ) : null}
            </div>
          )}
        </fieldset>
      ) : null}

      {shown ? (
        <table className="w-full border-collapse text-left" aria-live="polite">
          <caption className="pb-2.5 text-left font-mono text-xs font-semibold tracking-wider text-brand-text uppercase">
            {labels.prices}
          </caption>
          <tbody className="grid grid-cols-3 gap-2">
            {TIERS.map((tier) => {
              const saving = savingPerPiece(shown, tier);
              const best = tier === 'largeWholesale';
              return (
                <tr
                  key={tier}
                  className={cn(
                    'grid content-start gap-0.5 rounded-md border bg-background p-2.5 sm:p-3',
                    best
                      ? 'border-2 border-brand bg-brand-surface p-[0.5625rem] sm:p-[0.6875rem]'
                      : 'border-border-strong',
                  )}
                >
                  <th scope="row" className="text-xs font-normal text-muted-foreground sm:text-sm">
                    {labels.tiers[tier]}
                  </th>
                  <td className="text-base font-extrabold tabular-nums sm:text-lg">
                    {formatPrice(shown[tier])}
                  </td>
                  <td className="min-h-4 text-xs font-bold text-sale">
                    {saving ? (
                      <>
                        {labels.saving} {formatPrice(saving)} {labels.currency}
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="leading-relaxed">{labels.priceNote}</p>
      )}
    </div>
  );
}
