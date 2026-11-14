import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ProductionItem, ProductionOrder, ProductionStage } from '@admin/production/model';

/** Tabs of the item side panel. */
export type ProductionItemTab = 'work' | 'details' | 'fabric' | 'files';

const productionItemTabs: readonly ProductionItemTab[] = ['work', 'details', 'fabric', 'files'];

export interface PendingStage {
  item: ProductionItem;
  stage: ProductionStage;
}

/**
 * The open item side panel and its tab live in the address (`?item=3&tab=fabric`), so a link opens the same
 * item; «→ next stage» from a row waits here for its confirmation.
 */
export function useProductionItemPanel(order: ProductionOrder | null) {
  const [params, setParams] = useSearchParams();
  const [pending, setPending] = useState<PendingStage | null>(null);
  const itemId = Number(params.get('item'));
  const item = order?.items.find((x) => x.id === itemId) ?? null;
  const rawTab = params.get('tab') as ProductionItemTab | null;
  const tab: ProductionItemTab = rawTab && productionItemTabs.includes(rawTab) ? rawTab : 'work';

  function open(next: ProductionItem, nextTab: ProductionItemTab = tab) {
    setParams(
      (current) => {
        const copy = new URLSearchParams(current);
        copy.set('item', String(next.id));
        if (nextTab === 'work') copy.delete('tab');
        else copy.set('tab', nextTab);
        return copy;
      },
      { replace: item !== null },
    );
  }

  function close() {
    setParams(
      (current) => {
        const copy = new URLSearchParams(current);
        copy.delete('item');
        copy.delete('tab');
        return copy;
      },
      { replace: true },
    );
  }

  return {
    item,
    tab,
    open,
    close,
    setTab: (next: ProductionItemTab) => item && open(item, next),
    pending,
    askStage: (target: ProductionItem, stage: ProductionStage) =>
      setPending({ item: target, stage }),
    cancelStage: () => setPending(null),
  };
}
