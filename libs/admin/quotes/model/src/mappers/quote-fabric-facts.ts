import type { QuoteFabricFacts } from '../entities/quote-catalog';
import type { QuoteDraft, QuoteOptionDraft } from '../models/quote-draft';

/** One fabric of a price row for the manager line; `label` names it when the row is sewn from several. */
export interface QuoteOptionFabricRef {
  readonly fabricId: number;
  readonly label: string | null;
}

const meters = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const perMeter = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** The fabrics of a row: every fabric of a multi-fabric variant, else its one Reference fabric. */
export function quoteOptionFabrics(option: QuoteOptionDraft): readonly QuoteOptionFabricRef[] {
  if (option.fabrics.length > 1)
    return option.fabrics.map((fabric) => ({
      fabricId: fabric.fabricId,
      label: `${fabric.name} × ${meters.format(fabric.meters)} м`,
    }));
  const fabricId = option.fabrics[0]?.fabricId ?? option.fabricId;
  return fabricId === null ? [] : [{ fabricId, label: null }];
}

/** Every Reference fabric the КП shows, once, to load their manager lines in one request. */
export function quoteDraftFabricIds(draft: QuoteDraft): readonly number[] {
  const ids = new Set<number>();
  for (const item of draft.items)
    for (const option of item.options)
      for (const fabric of quoteOptionFabrics(option)) ids.add(fabric.fabricId);
  return [...ids].sort((a, b) => a - b);
}

/** «Склад: …», «Щільність: …», «133 грн/м»: the same parts under every fabric (R-31); the supplier goes last. */
export function quoteFabricFactsParts(facts: QuoteFabricFacts): readonly string[] {
  return [
    facts.composition ? `Склад: ${facts.composition}` : null,
    facts.density ? `Щільність: ${facts.density}` : null,
    `${perMeter.format(facts.pricePerMeter)} грн/м`,
  ].filter((part): part is string => part !== null);
}
