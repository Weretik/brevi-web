import { isSewingCreateReady } from '@admin/products/model';
import { useState } from 'react';

import { useSewingCardTab } from './use-sewing-card-tab';
import { useCanSeeCost } from '../product-access/use-can-see-cost';
import { useProductActiveSwitch } from '../product-overview/use-product-active-switch';
import { useSewingModelCard } from '../sewing-model/use-sewing-model-card';

import type { ProductDetail } from '@admin/products/model';

/** A sewing model card: its data and writes, the open tab, editing, deletion, the active switch and the article whose prices are open. */
export function useSewingProductCard({ product }: { product: ProductDetail }) {
  const { card, model, writes, modelCode } = useSewingModelCard(product.id);
  const { tab, setTab } = useSewingCardTab();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);
  const activeSwitch = useProductActiveSwitch(setActiveError);
  const [pricingArticleId, setPricingArticleId] = useState<number | null>(null);
  const showCost = useCanSeeCost();
  const launched =
    card.row?.isActive !== false && (!card.summaryLoaded || isSewingCreateReady(card.articles));
  const sectionName =
    card.row?.sectionId == null ? null : (card.sectionNames.get(card.row.sectionId) ?? null);
  return {
    card,
    model,
    writes,
    modelCode,
    tab,
    setTab,
    editing,
    setEditing,
    deleting,
    setDeleting,
    activeError,
    setActiveError,
    activeSwitch,
    pricingArticleId,
    setPricingArticleId,
    showCost,
    launched,
    sectionName,
  };
}
